import './style.css'
import exerciseSource from '../docs/EXERCICES.md?raw'
import gameDesignData from './games.json'

type GameWidget = {
  type: 'counter' | 'checklist' | 'fill' | 'turns'
  title: string
  description?: string
  unit?: string
  items: string[]
}

type GameDesign = {
  id: number
  promptLabel: string
  prompts: string[]
  roles: string[]
  materials: string[]
  instructions: string[]
  phases: [string, string, string]
  weights: [number, number, number]
  phaseSeconds?: [number, number, number]
  guidance: string
  widget?: GameWidget
}

type Exercise = {
  id: number
  title: string
  theme: string
  format: string
  modes: string[]
  duration: string
  minutes: number
  description: string
  design: GameDesign
}

type SessionRecord = {
  id: string
  exerciseId: number
  title: string
  date: string
  feeling: string
  note: string
}

type Phase = { name: string; seconds: number }
type PracticeSession = {
  exercise: Exercise
  topic: string
  roles: string[]
  phases: Phase[]
  phaseIndex: number
  remaining: number
  endAt: number | null
  running: boolean
  counter: number
  checkedItems: boolean[]
  fillValues: string[]
  round: number
}

const storageKey = 'parole-combat.sessions.v1'
const gameDesigns = gameDesignData as GameDesign[]
const gameDesignsById = new Map(gameDesigns.map((design) => [design.id, design]))
const root = document.querySelector<HTMLDivElement>('#app')
if (!root) throw new Error('Le point de montage de l’application est absent.')

const exercises = parseExercises(exerciseSource)
const themes = [...new Set(exercises.map((exercise) => exercise.theme))]
let selectedMode = 'tous'
let selectedTheme = 'tous'
let selectedDuration = 'toutes'
let query = ''
let selectedExercise: Exercise | null = null
let session: PracticeSession | null = null
let timerHandle: number | undefined
let storageError = false

function parseExercises(markdown: string): Exercise[] {
  const items: Exercise[] = []
  let theme = 'Autres'
  let current: { id: number; title: string; theme: string; lines: string[] } | null = null

  const saveCurrent = () => {
    if (!current) return
    const content = current.lines.join('\n')
    const meta = content.match(/\*\*Format :\*\*\s*(.+?)\s*·\s*\*\*Durée :\*\*\s*(.+?)(?:\s*·\s*\*\*Source :\*\*.*)?$/m)
    const format = meta?.[1]?.trim() ?? 'solo'
    const duration = meta?.[2]?.trim() ?? '5 min'
    const range = duration.match(/(\d+)\s*(?:à|-)\s*(\d+)\s*min/i)
    const single = duration.match(/(\d+)\s*min/i)
    const description = current.lines
      .filter((line) => !line.includes('**Format :**'))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
    const design = gameDesignsById.get(current.id)
    if (!design) throw new Error(`Aucun déroulé n’est défini pour l’exercice ${current.id}.`)

    items.push({
      id: current.id,
      title: current.title,
      theme: current.theme,
      format,
      modes: [
        ...['solo'].filter((mode) => format.toLocaleLowerCase('fr').includes(mode)),
        ...(/duo|partenaire/i.test(format) ? ['duo'] : []),
        ...(/groupe|public|personnes|auditoire/i.test(format) ? ['groupe'] : []),
      ],
      duration,
      minutes: Number(range?.[1] ?? single?.[1] ?? 5),
      description,
      design,
    })
  }

  for (const line of markdown.split(/\r?\n/)) {
    const section = line.match(/^## (.+)$/)
    if (section) {
      saveCurrent()
      current = null
      theme = section[1].trim()
      continue
    }
    const heading = line.match(/^### (\d+)\. (.+)$/)
    if (heading) {
      saveCurrent()
      current = { id: Number(heading[1]), title: heading[2].trim(), theme, lines: [] }
    } else if (current) {
      current.lines.push(line)
    }
  }
  saveCurrent()
  return items
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character] ?? character)
}

function readHistory(): SessionRecord[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    if (!Array.isArray(saved)) throw new Error('format invalide')
    return saved.filter((item): item is SessionRecord =>
      typeof item?.id === 'string' && typeof item?.title === 'string' && typeof item?.date === 'string',
    )
  } catch {
    storageError = true
    return []
  }
}

let history = readHistory()

function shell(content: string, active = 'decouvrir'): string {
  return `
    <header class="topbar">
      <a class="brand" href="#accueil" aria-label="La parole est un sport de combat, accueil">
        <span class="brand-mark" aria-hidden="true">LP</span>
        <span>LA PAROLE<small>EST UN SPORT DE COMBAT</small></span>
      </a>
      <nav class="main-nav" aria-label="Navigation principale">
        <button class="nav-link ${active === 'decouvrir' ? 'active' : ''}" data-action="home">Découvrir</button>
        <button class="nav-link ${active === 'historique' ? 'active' : ''}" data-action="history">Mes séances <span class="nav-count">${history.length}</span></button>
      </nav>
      <span class="privacy-note"><span></span> Vos données restent sur cet appareil</span>
    </header>
    ${storageError ? '<p class="storage-warning" role="status">Le navigateur ne peut pas lire l’historique local. Vous pouvez parcourir les exercices, mais vos séances ne seront peut-être pas enregistrées.</p>' : ''}
    <main>${content}</main>
    <footer><span>La parole est un sport de combat</span><span>32 exercices</span></footer>
  `
}

function renderCatalog(): void {
  if (timerHandle !== undefined) window.clearInterval(timerHandle)
  timerHandle = undefined
  selectedExercise = null
  session = null
  const filtered = exercises.filter((exercise) => {
    const matchesMode = selectedMode === 'tous' || exercise.modes.includes(selectedMode)
    const matchesTheme = selectedTheme === 'tous' || exercise.theme === selectedTheme
    const matchesDuration = selectedDuration === 'toutes'
      || (selectedDuration === '5' ? exercise.minutes <= 5 : selectedDuration === '10' ? exercise.minutes <= 10 : exercise.minutes > 10)
    const matchesQuery = !query || `${exercise.title} ${exercise.theme} ${exercise.description}`.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr'))
    return matchesMode && matchesTheme && matchesDuration && matchesQuery
  })
  root!.innerHTML = shell(`
    <section class="hero">
      <div class="hero-copy">
        <h1>Une idée.<br>Une voix.<br><span>À vous.</span></h1>
        <p class="hero-lede">Trente-deux exercices pour s’entraîner à son rythme, seul ou à plusieurs.</p>
        <a class="text-link" href="#catalogue">Voir les exercices <span aria-hidden="true">↓</span></a>
      </div>
      <div class="hero-ribbons" aria-hidden="true">
        <div class="ribbon ribbon-white ribbon-one">TROUVER SES MOTS</div>
        <div class="ribbon ribbon-red ribbon-two">PRENDRE SA PLACE</div>
        <div class="ribbon ribbon-white ribbon-three">RECOMMENCER</div>
        <div class="ribbon ribbon-red ribbon-four">À SA FAÇON</div>
      </div>
    </section>
    <section class="catalogue" id="catalogue">
      <div class="section-heading"><div><h2>Choisissez votre terrain.</h2></div><span class="result-count">${filtered.length} exercice${filtered.length > 1 ? 's' : ''}</span></div>
      <div class="filters" aria-label="Filtres des exercices">
        <label class="search-box"><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="Un exercice, une idée…" value="${escapeHtml(query)}" aria-label="Rechercher un exercice"></label>
        <label class="select-wrap"><span class="sr-only">Participants</span><select id="mode-filter"><option value="tous">Tous les formats</option><option value="solo" ${selectedMode === 'solo' ? 'selected' : ''}>En solo</option><option value="duo" ${selectedMode === 'duo' ? 'selected' : ''}>À deux</option><option value="groupe" ${selectedMode === 'groupe' ? 'selected' : ''}>En groupe</option></select></label>
        <label class="select-wrap"><span class="sr-only">Thème</span><select id="theme-filter"><option value="tous">Tous les thèmes</option>${themes.map((theme) => `<option value="${escapeHtml(theme)}" ${selectedTheme === theme ? 'selected' : ''}>${escapeHtml(theme)}</option>`).join('')}</select></label>
        <label class="select-wrap"><span class="sr-only">Durée</span><select id="duration-filter"><option value="toutes">Toutes les durées</option><option value="5" ${selectedDuration === '5' ? 'selected' : ''}>5 min ou moins</option><option value="10" ${selectedDuration === '10' ? 'selected' : ''}>10 min ou moins</option><option value="long" ${selectedDuration === 'long' ? 'selected' : ''}>Plus de 10 min</option></select></label>
      </div>
      ${filtered.length ? `<section class="exercise-section"><div class="exercise-grid">${filtered.map(card).join('')}</div></section>` : ''}
      ${!filtered.length ? '<div class="empty-state"><h3>Aucun exercice ne correspond.</h3><p>Essayez un autre filtre ou un mot différent.</p><button class="button button-quiet" data-action="clear-filters">Effacer les filtres</button></div>' : ''}
    </section>
  `)
  bindCatalogControls()
}

function card(exercise: Exercise): string {
  return `<article class="exercise-card" role="button" tabindex="0" data-action="open-exercise" data-id="${exercise.id}" aria-label="Jouer à ${escapeHtml(exercise.title)}">
    <div class="card-top"><span class="theme-label">${escapeHtml(exercise.theme)}</span><span class="card-duration">${escapeHtml(exercise.duration)}</span></div>
    <h3>${escapeHtml(exercise.title)}</h3><p>${escapeHtml(exercise.description.slice(0, 128))}${exercise.description.length > 128 ? '…' : ''}</p>
    <div class="card-meta"><span>${escapeHtml(exercise.format)}</span><span class="card-arrow" aria-hidden="true">↗</span></div>
  </article>`
}

function bindCatalogControls(): void {
  root!.querySelector<HTMLInputElement>('#search')?.addEventListener('input', (event) => {
    const input = event.currentTarget as HTMLInputElement
    query = input.value
    const cursor = input.selectionStart
    renderCatalog()
    const next = root!.querySelector<HTMLInputElement>('#search')
    next?.focus()
    next?.setSelectionRange(cursor, cursor)
  })
  root!.querySelector<HTMLSelectElement>('#mode-filter')?.addEventListener('change', (event) => {
    selectedMode = (event.currentTarget as HTMLSelectElement).value
    renderCatalog()
  })
  root!.querySelector<HTMLSelectElement>('#theme-filter')?.addEventListener('change', (event) => {
    selectedTheme = (event.currentTarget as HTMLSelectElement).value
    renderCatalog()
  })
  root!.querySelector<HTMLSelectElement>('#duration-filter')?.addEventListener('change', (event) => {
    selectedDuration = (event.currentTarget as HTMLSelectElement).value
    renderCatalog()
  })
}

function renderDetail(exercise: Exercise): void {
  selectedExercise = exercise
  const { design } = exercise
  root!.innerHTML = shell(`
    <section class="detail-page">
      <button class="back-link" data-action="home">← Tous les exercices</button>
      <div class="detail-layout">
        <article class="detail-main">
          <p class="eyebrow">${escapeHtml(exercise.theme)} <i></i> ${escapeHtml(exercise.duration)}</p>
          <h1>${escapeHtml(exercise.title)}<span class="title-period">.</span></h1>
          <p class="detail-lede">${escapeHtml(exercise.description)}</p>
          <div class="detail-block"><p class="eyebrow">LE DÉROULÉ DE CET EXERCICE</p><ol class="step-list">${design.instructions.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol></div>
          <div class="detail-block"><p class="eyebrow">FORMAT ET MATÉRIEL</p><p class="detail-format">${escapeHtml(exercise.format)}</p><ul class="material-list">${design.materials.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul><p class="muted">${escapeHtml(design.guidance)}</p></div>
          ${design.roles.length > 1 ? `<div class="detail-block"><p class="eyebrow">RÔLES À DISTRIBUER</p><p class="role-summary">${design.roles.map(escapeHtml).join(' · ')}</p></div>` : ''}
        </article>
        <aside class="start-card"><span class="start-mark"></span><h2>À vous de jouer.</h2><button class="button button-primary" data-action="start-session" data-id="${exercise.id}">Lancer la séance <span>→</span></button></aside>
      </div>
    </section>
  `)
}

function startSession(exercise: Exercise): void {
  const design = exercise.design
  const total = Math.max(exercise.minutes * 60, 90)
  const firstDefault = Math.max(30, Math.round(total * design.weights[0] / 1500) * 15)
  const secondDefault = Math.max(30, Math.round(total * design.weights[1] / 1500) * 15)
  const defaultDurations: [number, number, number] = [
    firstDefault,
    secondDefault,
    Math.max(30, total - firstDefault - secondDefault),
  ]
  const [first, second, third] = design.phaseSeconds ?? defaultDurations
  session = {
    exercise,
    topic: chooseDifferent(design.prompts),
    roles: shuffle(design.roles),
    phases: design.phases.map((name, index) => ({ name, seconds: [first, second, third][index] })),
    phaseIndex: 0,
    remaining: first,
    endAt: null,
    running: false,
    counter: 0,
    checkedItems: Array(design.widget?.type === 'checklist' ? design.widget.items.length : 0).fill(false),
    fillValues: Array(design.widget?.type === 'fill' ? design.widget.items.length : 0).fill(''),
    round: 0,
  }
  renderSession()
}

function chooseDifferent(values: string[], current = ''): string {
  const alternatives = values.filter((value) => value !== current)
  const choices = alternatives.length ? alternatives : values
  return choices[Math.floor(Math.random() * choices.length)] ?? ''
}

function shuffle<T>(values: T[]): T[] {
  const result = [...values]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swap]] = [result[swap], result[index]]
  }
  return result
}

function renderGameWidget(current: PracticeSession): string {
  const widget = current.exercise.design.widget
  if (!widget) return ''
  if (widget.type === 'counter') {
    return `<section class="game-widget" aria-label="${escapeHtml(widget.title)}"><div class="widget-heading"><h2>${escapeHtml(widget.title)}</h2><p>${escapeHtml(widget.description ?? '')}</p></div><div class="counter-control"><button data-action="counter-change" data-delta="-1" aria-label="Retirer une occurrence">−</button><output aria-live="polite">${current.counter}</output><button data-action="counter-change" data-delta="1" aria-label="Ajouter une occurrence">+</button><span>${escapeHtml(widget.unit ?? '')}${current.counter > 1 ? 's' : ''}</span></div></section>`
  }
  if (widget.type === 'checklist') {
    return `<section class="game-widget"><div class="widget-heading"><h2>${escapeHtml(widget.title)}</h2></div><ul class="widget-checklist">${widget.items.map((item, index) => `<li><button data-action="toggle-check" data-index="${index}" aria-pressed="${current.checkedItems[index] ? 'true' : 'false'}" class="check-item ${current.checkedItems[index] ? 'checked' : ''}"><span aria-hidden="true">${current.checkedItems[index] ? '✓' : ''}</span>${escapeHtml(item)}</button></li>`).join('')}</ul></section>`
  }
  if (widget.type === 'fill') {
    return `<section class="game-widget"><div class="widget-heading"><h2>${escapeHtml(widget.title)}</h2></div><div class="fill-fields">${widget.items.map((item, index) => `<label>${escapeHtml(item)}<input data-fill-index="${index}" maxlength="90" value="${escapeHtml(current.fillValues[index] ?? '')}" placeholder="Votre réponse"></label>`).join('')}</div></section>`
  }
  const role = current.roles[current.round % current.roles.length] ?? ''
  return `<section class="game-widget"><div class="widget-heading"><h2>${escapeHtml(widget.title)}</h2><p>${escapeHtml(widget.description ?? '')}</p></div><div class="turn-card"><span>TOUR ${current.round + 1}</span><strong>${escapeHtml(role)}</strong><button class="button button-outline" data-action="next-turn">Tour suivant →</button></div></section>`
}

function renderSession(): void {
  if (!session) return
  const phase = session.phases[session.phaseIndex]
  const design = session.exercise.design
  const total = session.phases.reduce((sum, item) => sum + item.seconds, 0)
  const elapsed = total - session.phases.slice(0, session.phaseIndex).reduce((sum, item) => sum + item.seconds, 0) - session.remaining
  const progress = Math.max(0, Math.min(100, elapsed / total * 100))
  root!.innerHTML = shell(`
    <section class="session-page">
      <button class="back-link" data-action="exit-session">← Quitter la séance</button>
      <div class="session-layout">
        <div class="session-left">
          <p class="eyebrow">${escapeHtml(session.exercise.title)} <i></i> ÉTAPE ${session.phaseIndex + 1} SUR ${session.phases.length}</p>
          <h1>${escapeHtml(phase.name)}<span class="title-period">.</span></h1>
          <p class="session-instruction">${escapeHtml(design.instructions[session.phaseIndex] ?? design.guidance)}</p>
          <div class="topic-card"><span class="topic-label">${escapeHtml(design.promptLabel).toLocaleUpperCase('fr')}</span><p>${escapeHtml(session.topic)}</p><button class="topic-refresh" data-action="new-topic" aria-label="Tirer une autre consigne">↻ <span>Autre proposition</span></button></div>
          ${session.roles.length > 1 ? `<section class="roles-panel"><div class="roles-heading"><span class="topic-label">RÔLES POUR CETTE PARTIE</span><button data-action="reroll-roles">Réattribuer ↻</button></div><div class="role-chips">${session.roles.map((role, index) => `<span class="role-chip"><b>${index + 1}</b>${escapeHtml(role)}</span>`).join('')}</div></section>` : ''}
          <div class="session-materials"><span class="topic-label">MATÉRIEL</span><p>${design.materials.map(escapeHtml).join(' · ')}</p></div>
          ${renderGameWidget(session)}
          <div class="phase-track" aria-label="Progression de la séance">${session.phases.map((item, index) => `<div class="phase-step ${index < session!.phaseIndex ? 'done' : index === session!.phaseIndex ? 'current' : ''}"><span>${index < session!.phaseIndex ? '✓' : `0${index + 1}`}</span>${item.name}</div>`).join('')}</div>
        </div>
        <aside class="timer-card">
          <span class="timer-kicker">TEMPS POUR VOUS</span>
          <div class="timer" role="timer" aria-live="off">${formatTime(session.remaining)}</div>
          <div class="timer-progress"><span style="width:${progress}%"></span></div>
          <div class="timer-controls"><button class="button button-primary" data-action="toggle-timer">${session.running ? 'Pause' : session.remaining === phase.seconds ? 'Démarrer' : 'Reprendre'} <span>${session.running ? 'Ⅱ' : '▶'}</span></button><button class="button button-outline" data-action="reset-timer">Recommencer cette phase</button><button class="text-button" data-action="advance-phase">${session.phaseIndex === session.phases.length - 1 ? 'Terminer la séance' : 'Passer à la suite →'}</button></div>
        </aside>
      </div>
    </section>
  `)
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0')
  const rest = (seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${rest}`
}

function syncTimer(): void {
  if (!session?.running || session.endAt === null) return
  session.remaining = Math.max(0, Math.ceil((session.endAt - Date.now()) / 1000))
  if (session.remaining === 0) {
    if (session.phaseIndex < session.phases.length - 1) {
      session.phaseIndex += 1
      session.remaining = session.phases[session.phaseIndex].seconds
      session.endAt = Date.now() + session.remaining * 1000
    } else {
      session.running = false
      session.endAt = null
      if (timerHandle !== undefined) window.clearInterval(timerHandle)
      timerHandle = undefined
      renderSessionComplete()
      return
    }
  }
  const timer = root!.querySelector<HTMLElement>('.timer')
  if (timer) timer.textContent = formatTime(session.remaining)
  const step = root!.querySelector('.phase-step.current')
  if (step) {
    const elapsed = session.phases.slice(0, session.phaseIndex).reduce((sum, item) => sum + item.seconds, 0) + session.phases[session.phaseIndex].seconds - session.remaining
    const total = session.phases.reduce((sum, item) => sum + item.seconds, 0)
    const bar = root!.querySelector<HTMLElement>('.timer-progress span')
    if (bar) bar.style.width = `${Math.max(0, elapsed / total * 100)}%`
  }
  if (!root!.querySelector('.session-left h1')?.textContent?.startsWith(session.phases[session.phaseIndex].name)) renderSession()
}

function advancePhase(): void {
  if (!session) return
  if (timerHandle !== undefined) window.clearInterval(timerHandle)
  timerHandle = undefined
  session.running = false
  session.endAt = null
  if (session.phaseIndex >= session.phases.length - 1) {
    renderSessionComplete()
    return
  }
  session.phaseIndex += 1
  session.remaining = session.phases[session.phaseIndex].seconds
  renderSession()
}

function renderSessionComplete(): void {
  if (!session) return
  root!.innerHTML = shell(`
    <section class="complete-page">
      <div class="complete-mark"></div><p class="eyebrow">UNE RÉPÉTITION DE PLUS</p><h1>Vous l’avez fait<span class="title-period">.</span></h1>
      <p class="complete-lede">Vous avez pris le temps de pratiquer. Gardez une petite idée pour la prochaine fois.</p>
      <form id="reflection-form" class="reflection-form">
        <label for="feeling">Comment vous êtes-vous senti·e ?</label>
        <select id="feeling" name="feeling"><option value="">Choisir (facultatif)</option><option>Plus à l’aise</option><option>Curieux·se</option><option>Un peu hésitant·e</option><option>Prêt·e à recommencer</option></select>
        <label for="note">Une chose à retenir ou à essayer la prochaine fois</label>
        <textarea id="note" name="note" rows="3" maxlength="500" placeholder="Quelques mots pour vous…"></textarea>
        <button class="button button-primary" type="submit">Enregistrer mon bilan <span>→</span></button>
        <button class="text-button" type="button" data-action="home">Passer, revenir aux exercices</button>
      </form>
    </section>
  `)
}

function renderHistory(): void {
  root!.innerHTML = shell(`
    <section class="history-page"><p class="eyebrow">VOTRE CHEMIN</p><div class="section-heading"><div><h1>Mes séances<span class="title-period">.</span></h1><p class="history-intro">Chaque répétition compte. Cette liste reste sur votre appareil.</p></div>${history.length ? '<button class="text-button danger-link" data-action="clear-history">Effacer l’historique</button>' : ''}</div>
    ${history.length ? `<div class="history-list">${history.map((item) => `<article class="history-item"><span class="history-date">${escapeHtml(new Intl.DateTimeFormat('fr-BE', { dateStyle: 'medium' }).format(new Date(item.date)))}</span><div><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.feeling || 'Séance terminée')}${item.note ? ` · ${escapeHtml(item.note)}` : ''}</p></div><span class="history-star" aria-hidden="true">FAIT</span></article>`).join('')}</div>` : '<div class="empty-state"><h3>Votre première séance vous attend.</h3><p>Terminez un exercice et votre bilan apparaîtra ici.</p><button class="button button-primary" data-action="home">Trouver un exercice</button></div>'}
    </section>
  `, 'historique')
}

root.addEventListener('click', (event) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>('[data-action]')
  if (!target) return
  const action = target.dataset.action
  if (action === 'home') renderCatalog()
  if (action === 'history') renderHistory()
  if (action === 'open-exercise') {
    const exercise = exercises.find((item) => item.id === Number(target.dataset.id))
    if (exercise) renderDetail(exercise)
  }
  if (action === 'start-session') {
    const exercise = exercises.find((item) => item.id === Number(target.dataset.id))
    if (exercise) startSession(exercise)
  }
  if (action === 'new-topic' && session) {
    session.topic = chooseDifferent(session.exercise.design.prompts, session.topic)
    renderSession()
  }
  if (action === 'reroll-roles' && session) {
    session.roles = shuffle(session.exercise.design.roles)
    renderSession()
  }
  if (action === 'counter-change' && session) {
    session.counter = Math.max(0, session.counter + Number(target.dataset.delta ?? 0))
    renderSession()
  }
  if (action === 'toggle-check' && session) {
    const index = Number(target.dataset.index)
    if (Number.isInteger(index) && index >= 0 && index < session.checkedItems.length) {
      session.checkedItems[index] = !session.checkedItems[index]
      renderSession()
    }
  }
  if (action === 'next-turn' && session) {
    session.round += 1
    renderSession()
  }
  if (action === 'advance-phase' && session) advancePhase()
  if (action === 'toggle-timer' && session) {
    session.running = !session.running
    if (session.running) {
      session.endAt = Date.now() + session.remaining * 1000
      timerHandle = window.setInterval(syncTimer, 250)
    } else {
      session.remaining = Math.max(0, Math.ceil(((session.endAt ?? Date.now()) - Date.now()) / 1000))
      session.endAt = null
      if (timerHandle !== undefined) window.clearInterval(timerHandle)
      timerHandle = undefined
    }
    renderSession()
  }
  if (action === 'reset-timer' && session) {
    if (timerHandle !== undefined) window.clearInterval(timerHandle)
    timerHandle = undefined
    session.running = false
    session.endAt = null
    session.phaseIndex = 0
    session.remaining = session.phases[0].seconds
    renderSession()
  }
  if (action === 'exit-session') {
    if (timerHandle !== undefined) window.clearInterval(timerHandle)
    timerHandle = undefined
    renderDetail(selectedExercise ?? session!.exercise)
  }
  if (action === 'clear-filters') {
    selectedMode = 'tous'; selectedTheme = 'tous'; selectedDuration = 'toutes'; query = ''
    renderCatalog()
  }
  if (action === 'clear-history' && window.confirm('Effacer les bilans de séance enregistrés sur cet appareil ?')) {
    history = []
    try { localStorage.removeItem(storageKey); storageError = false } catch { storageError = true }
    renderHistory()
  }
})

root.addEventListener('keydown', (event) => {
  const target = event.target
  if (!(target instanceof HTMLElement) || !target.matches('.exercise-card[role="button"]')) return
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  const exercise = exercises.find((item) => item.id === Number(target.dataset.id))
  if (exercise) renderDetail(exercise)
})

root.addEventListener('submit', (event) => {
  const form = event.target
  if (!(form instanceof HTMLFormElement) || form.id !== 'reflection-form' || !session) return
  event.preventDefault()
  const values = new FormData(form)
  const record: SessionRecord = {
    id: crypto.randomUUID(),
    exerciseId: session.exercise.id,
    title: session.exercise.title,
    date: new Date().toISOString(),
    feeling: String(values.get('feeling') ?? ''),
    note: String(values.get('note') ?? '').slice(0, 500),
  }
  history = [record, ...history].slice(0, 100)
  try {
    localStorage.setItem(storageKey, JSON.stringify(history))
    storageError = false
    renderHistory()
  } catch {
    history = history.filter((item) => item.id !== record.id)
    storageError = true
    renderSessionComplete()
    const feeling = root!.querySelector<HTMLSelectElement>('#feeling')
    const note = root!.querySelector<HTMLTextAreaElement>('#note')
    if (feeling) feeling.value = record.feeling
    if (note) note.value = record.note
    const warning = document.createElement('p')
    warning.className = 'inline-warning'
    warning.setAttribute('role', 'alert')
    warning.textContent = 'Le navigateur n’a pas pu enregistrer votre bilan. Vous pouvez copier votre note avant de quitter.'
    root!.querySelector('.reflection-form')?.prepend(warning)
  }
})

root.addEventListener('input', (event) => {
  const input = event.target
  if (!(input instanceof HTMLInputElement) || input.dataset.fillIndex === undefined || !session) return
  const index = Number(input.dataset.fillIndex)
  if (Number.isInteger(index) && index >= 0 && index < session.fillValues.length) {
    session.fillValues[index] = input.value.slice(0, 90)
  }
})

renderCatalog()
