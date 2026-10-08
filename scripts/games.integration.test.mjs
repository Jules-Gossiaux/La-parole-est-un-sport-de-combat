import assert from 'node:assert/strict'
import test from 'node:test'
import { createServer } from 'vite'

test('les 32 exercices s’ouvrent, déroulent leurs phases et enregistrent un bilan', async () => {
  const { Window } = await import('happy-dom')
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
      assert.ok(root.querySelector('.session-materials p')?.textContent.trim(), `exercice ${id}: matériel absent`)
      assert.equal(root.querySelectorAll('.phase-step').length, 3, `exercice ${id}: phases manquantes`)

      const initialPrompt = root.querySelector('.topic-card p').textContent
      click(root, '[data-action="new-topic"]')
      assert.notEqual(root.querySelector('.topic-card p').textContent, initialPrompt, `exercice ${id}: autre proposition indisponible`)
      const initialRoleCount = root.querySelectorAll('.role-chip').length
      if (initialRoleCount > 1) {
        click(root, '[data-action="reroll-roles"]')
        assert.equal(root.querySelectorAll('.role-chip').length, initialRoleCount, `exercice ${id}: rôles non réattribués`)
      }

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
      for (let phase = 0; phase < 3; phase += 1) click(root, '[data-action="advance-phase"]')
      assert.ok(root.querySelector('#reflection-form'), `exercice ${id}: fin de séance absente`)
      const note = root.querySelector('#note')
      note.value = `bilan ${id}`
      const form = root.querySelector('#reflection-form')
      form.dispatchEvent(new browser.Event('submit', { bubbles: true, cancelable: true }))
      assert.ok(root.querySelector('.history-item h2')?.textContent, `exercice ${id}: bilan non enregistré`)
      click(root, 'button[data-action="home"]')
    }

    click(root, 'button[data-action="history"]')
    assert.equal(root.querySelectorAll('.history-item').length, 32, 'les 32 bilans devraient être présents')
  } finally {
    await vite.close()
    await browser.happyDOM.abort()
    Object.assign(globalThis, globals)
  }
})
