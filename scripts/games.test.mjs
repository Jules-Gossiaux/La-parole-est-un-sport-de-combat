import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const [catalogue, gameJson] = await Promise.all([
  readFile(new URL('../docs/EXERCICES.md', import.meta.url), 'utf8'),
  readFile(new URL('../src/games.json', import.meta.url), 'utf8'),
])

const catalogueIds = [...catalogue.matchAll(/^### (\d+)\./gm)].map((match) => Number(match[1]))
const games = JSON.parse(gameJson)

test('chaque fiche du catalogue a un jeu correspondant, une seule fois', () => {
  const gameIds = games.map((game) => game.id)
  assert.equal(catalogueIds.length, 32)
  assert.deepEqual(gameIds, catalogueIds)
  assert.equal(new Set(gameIds).size, gameIds.length)
})

test('chaque jeu a des consignes, des rôles, du matériel, des sujets et trois phases', () => {
  for (const game of games) {
    assert.ok(game.promptLabel, `exercice ${game.id}: libellé de consigne manquant`)
    assert.ok(game.prompts.length >= 2, `exercice ${game.id}: sujets insuffisants`)
    assert.ok(game.roles.length >= 1, `exercice ${game.id}: rôle manquant`)
    assert.equal(game.roleTasks.length, game.roles.length > 1 ? game.roles.length : 0, `exercice ${game.id}: consigne de rôle manquante`)
    assert.ok(game.roleTasks.every((task) => task.trim().length > 10), `exercice ${game.id}: responsabilité de rôle trop vague`)
    assert.ok(game.materials.length >= 1, `exercice ${game.id}: matériel non précisé`)
    assert.equal(game.instructions.length, 3, `exercice ${game.id}: il faut trois consignes de phase`)
    assert.equal(game.phases.length, 3, `exercice ${game.id}: il faut trois phases`)
    assert.ok(game.guidance, `exercice ${game.id}: conseil manquant`)
    assert.ok(game.instructions.every((instruction) => instruction.trim().length > 12))
    assert.ok(game.phases.every((phase) => phase.trim().length > 2))
  }
})

test('la durée de chaque jeu est répartie en trois poids qui totalisent 100', () => {
  for (const game of games) {
    assert.equal(game.weights.length, 3, `exercice ${game.id}: poids de phase manquant`)
    assert.ok(game.weights.every((weight) => Number.isInteger(weight) && weight > 0))
    assert.equal(game.weights.reduce((sum, weight) => sum + weight, 0), 100)
    if (game.phaseSeconds) {
      assert.equal(game.phaseSeconds.length, 3, `exercice ${game.id}: il faut trois durées`)
      assert.ok(game.phaseSeconds.every((seconds) => Number.isInteger(seconds) && seconds > 0))
    }
    if (game.widget) assert.ok(Number.isInteger(game.widgetPhase) && game.widgetPhase >= 0 && game.widgetPhase < 3, `exercice ${game.id}: étape de l’outil manquante`)
  }
})

test('les activités interactives ciblées ont un outil adapté', () => {
  const byId = new Map(games.map((game) => [game.id, game]))
  assert.equal(byId.get(12).widget.type, 'counter')
  assert.equal(byId.get(13).widget.type, 'checklist')
  assert.equal(byId.get(15).widget.type, 'fill')
  assert.equal(byId.get(16).widget.type, 'turns')
  assert.equal(byId.get(26).widget.type, 'checklist')
  assert.equal(byId.get(31).widget.type, 'counter')
})

test('les sujets de débat sont des questions fermées', () => {
  const debateIds = [13, 16, 17, 18, 19, 24, 26, 27, 28]
  const byId = new Map(games.map((game) => [game.id, game]))
  for (const id of debateIds) {
    for (const prompt of byId.get(id).prompts) {
      assert.ok(prompt.endsWith('?'), `exercice ${id}: le sujet doit être une question : ${prompt}`)
      assert.doesNotMatch(prompt, /^(comment|pourquoi|que|qu['’]est-ce|quel(?:le)?s?)\b/i, `exercice ${id}: question ouverte : ${prompt}`)
    }
  }
})
