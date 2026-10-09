import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { createServer } from 'vite'

test('les 32 exercices s’ouvrent, déroulent leurs phases et enregistrent un bilan', async () => {
  const { Window } = await import('happy-dom')
  const games = JSON.parse(await readFile(new URL('../src/games.json', import.meta.url), 'utf8'))
  const browser = new Window({ url: 'http://localhost:4173/' })
  const globals = {
    window: globalThis.window,
    document: globalThis.document,
    HTMLElement: globalThis.HTMLElement,
    localStorage: globalThis.localStorage,
    HTMLDivElement: globalThis.HTMLDivElement,
    HTMLButtonElement: globalThis.HTMLButtonElement,
    HTMLInputElement: globalThis.HTMLInputElement,
    HTMLSelectElement: globalThis.HTMLSelectElement,
    HTMLFormElement: globalThis.HTMLFormElement,
    FormData: globalThis.FormData,
  }

  Object.assign(globalThis, {
    window: browser,
    document: browser.document,
    HTMLElement: browser.HTMLElement,
    localStorage: browser.localStorage,
    HTMLDivElement: browser.HTMLDivElement,
    HTMLButtonElement: browser.HTMLButtonElement,
    HTMLInputElement: browser.HTMLInputElement,
    HTMLSelectElement: browser.HTMLSelectElement,
    HTMLFormElement: browser.HTMLFormElement,
    FormData: browser.FormData,
  })

  const vite = await createServer({
    configFile: false,
    root: process.cwd(),
    server: { middlewareMode: true },
    appType: 'custom',
    logLevel: 'error',
  })

  const click = (root, selector) => {
    const element = root.querySelector(selector)
    assert.ok(element, `élément manquant: ${selector}`)
    element.dispatchEvent(new browser.MouseEvent('click', { bubbles: true, cancelable: true }))
    return element
  }

  try {
    browser.document.body.innerHTML = '<div id="app"></div>'
    await vite.ssrLoadModule('/src/main.ts')
    const root = browser.document.querySelector('#app')

    const firstCard = root.querySelector('.exercise-card')
    firstCard.dispatchEvent(new browser.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    assert.ok(root.querySelector('.detail-main h1'), 'la carte doit pouvoir être ouverte au clavier')
    click(root, 'button[data-action="home"]')

    for (let id = 1; id <= 32; id += 1) {
      const card = click(root, `.exercise-card[data-action="open-exercise"][data-id="${id}"]`)
      assert.equal(card.getAttribute('role'), 'button', `exercice ${id}: carte non interactive`)
      assert.ok(root.querySelector('.detail-main h1'), `exercice ${id}: fiche absente`)
      click(root, `button[data-action="start-session"][data-id="${id}"]`)
      assert.ok(root.querySelector('.session-page'), `exercice ${id}: séance absente`)
      assert.ok(root.querySelector('.topic-card p')?.textContent.trim(), `exercice ${id}: consigne absente`)
      assert.ok(root.querySelector('.materials-details summary')?.textContent.trim(), `exercice ${id}: matériel absent`)
      assert.equal(root.querySelectorAll('.phase-step').length, 3, `exercice ${id}: phases manquantes`)
      assert.equal(root.querySelector('#current-step-title').textContent.replace('.', ''), games[id - 1].phases[0], `exercice ${id}: étape active absente`)
      assert.ok(root.querySelector('.session-instruction').textContent.includes(games[id - 1].instructions[0]), `exercice ${id}: action de l’étape absente`)

      const initialPrompt = root.querySelector('.topic-card p').textContent
      click(root, '[data-action="new-topic"]')
      assert.notEqual(root.querySelector('.topic-card p').textContent, initialPrompt, `exercice ${id}: autre proposition indisponible`)
      const roleItems = root.querySelectorAll('.role-list li')
      assert.equal(roleItems.length, games[id - 1].roles.length > 1 ? games[id - 1].roles.length : 0, `exercice ${id}: rôles mal attribués`)
      roleItems.forEach((item, index) => {
        assert.equal(item.querySelector('.role-name').textContent, games[id - 1].roles[index], `exercice ${id}: ordre des rôles modifié`)
        assert.equal(item.querySelectorAll('span')[1].textContent, games[id - 1].roleTasks[index], `exercice ${id}: mission incorrecte`)
      })

      while (games[id - 1].widget && !root.querySelector('.game-widget')) click(root, '[data-action="advance-phase"]')

      const counter = root.querySelector('[data-action="counter-change"][data-delta="1"]')
      if (counter) {
        click(root, '[data-action="counter-change"][data-delta="1"]')
        assert.equal(root.querySelector('.counter-control output').textContent, '1', `exercice ${id}: compteur inactif`)
      }
      if (root.querySelector('[data-action="toggle-check"]')) {
        click(root, '[data-action="toggle-check"]')
        assert.equal(root.querySelector('[data-action="toggle-check"]').getAttribute('aria-pressed'), 'true', `exercice ${id}: repère non sélectionnable`)
      }
      const fill = root.querySelector('[data-fill-index="0"]')
      if (fill) {
        fill.value = 'un exemple personnel'
        fill.dispatchEvent(new browser.Event('input', { bubbles: true }))
        assert.equal(fill.value, 'un exemple personnel', `exercice ${id}: champ de réponse inactif`)
      }
      if (root.querySelector('[data-action="next-turn"]')) {
        click(root, '[data-action="next-turn"]')
        assert.match(root.querySelector('.turn-card').textContent, /TOUR 2/, `exercice ${id}: tour non avancé`)
      }

      click(root, '[data-action="toggle-timer"]')
      assert.match(root.querySelector('[data-action="toggle-timer"]').textContent, /Pause/, `exercice ${id}: minuteur non démarré`)
      click(root, '[data-action="toggle-timer"]')
      while (root.querySelector('.session-page')) click(root, '[data-action="advance-phase"]')
      assert.ok(root.querySelector('#reflection-form'), `exercice ${id}: fin de séance absente`)
      const note = root.querySelector('#note')
      note.value = `bilan ${id}`
      const form = root.querySelector('#reflection-form')
      form.dispatchEvent(new browser.Event('submit', { bubbles: true, cancelable: true }))
      assert.ok(root.querySelector('.history-item h2')?.textContent, `exercice ${id}: bilan non enregistré`)
      click(root, 'button[data-action="home"]')
    }

    click(root, '.exercise-card[data-id="1"]')
    click(root, 'button[data-action="start-session"][data-id="1"]')
    click(root, '[data-action="advance-phase"]')
    assert.equal(root.querySelector('#current-step-title').textContent.replace('.', ''), games[0].phases[1], 'l’étape doit changer avec sa consigne')
    assert.ok(root.querySelector('.session-instruction').textContent.includes(games[0].instructions[1]), 'la consigne de la nouvelle étape doit être visible')
    click(root, '[data-action="exit-session"]')
    click(root, 'button[data-action="home"]')

    click(root, 'button[data-action="history"]')
    assert.equal(root.querySelectorAll('.history-item').length, 32, 'les 32 bilans devraient être présents')
  } finally {
    await vite.close()
    await browser.happyDOM.abort()
    Object.assign(globalThis, globals)
  }
})
