import type {
  FlagCard,
  FlashcardSet,
  FlashcardSetId,
  MonarchCard,
  MonarchPrompt,
  PresidentCard,
  RiichiCard,
  RiichiTermPrompt,
  StudyCard,
  StudyOptions,
} from '../types'

function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

function pickMonarchPrompt(
  mode: StudyOptions['monarchPrompt'],
): MonarchPrompt {
  if (mode === 'mix') return Math.random() < 0.5 ? 'name' : 'reign'
  return mode
}

function pickRiichiTermPrompt(
  mode: StudyOptions['riichiTermPrompt'],
): RiichiTermPrompt {
  if (mode === 'mix') return Math.random() < 0.5 ? 'term' : 'definition'
  return mode
}

export function buildDeck(
  sets: FlashcardSet[],
  options: StudyOptions,
): StudyCard[] {
  const deck: StudyCard[] = []

  for (const set of sets) {
    if (set.kind === 'flag-fact') {
      for (const card of set.cards as FlagCard[]) {
        deck.push({
          key: `${set.id}:${card.id}`,
          setId: set.id as FlashcardSetId,
          setTitle: set.title,
          kind: 'flag-fact',
          payload: card,
        })
      }
    }

    if (set.kind === 'monarch-dual') {
      for (const card of set.cards as MonarchCard[]) {
        const prompt = pickMonarchPrompt(options.monarchPrompt)
        deck.push({
          key: `${set.id}:${card.id}:${prompt}`,
          setId: set.id as FlashcardSetId,
          setTitle: set.title,
          kind: 'monarch-dual',
          payload: card,
          prompt,
        })
      }
    }

    if (set.kind === 'president-fact') {
      for (const card of set.cards as PresidentCard[]) {
        deck.push({
          key: `${set.id}:${card.id}`,
          setId: set.id as FlashcardSetId,
          setTitle: set.title,
          kind: 'president-fact',
          payload: card,
        })
      }
    }

    if (set.kind === 'riichi-mahjong') {
      for (const card of set.cards as RiichiCard[]) {
        if (card.kind === 'term') {
          const prompt = pickRiichiTermPrompt(options.riichiTermPrompt)
          deck.push({
            key: `${set.id}:${card.id}:${prompt}`,
            setId: set.id as FlashcardSetId,
            setTitle: set.title,
            kind: 'riichi-term',
            payload: card,
            prompt,
          })
        } else if (card.kind === 'score') {
          deck.push({
            key: `${set.id}:${card.id}`,
            setId: set.id as FlashcardSetId,
            setTitle: set.title,
            kind: 'riichi-score',
            payload: card,
          })
        } else {
          deck.push({
            key: `${set.id}:${card.id}`,
            setId: set.id as FlashcardSetId,
            setTitle: set.title,
            kind: 'riichi-glyph',
            payload: card,
          })
        }
      }
    }
  }

  return shuffle(deck)
}

export function formatPopulation(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}
