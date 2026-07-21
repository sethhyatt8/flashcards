import ukMonarchs from '../data/uk-monarchs.json'
import usPresidents from '../data/us-presidents.json'
import worldFlags from '../data/world-flags.json'
import type {
  FlagCard,
  FlashcardSet,
  FlashcardSetId,
  MonarchCard,
  PresidentCard,
} from '../types'

export const flashcardSets: FlashcardSet[] = [
  {
    id: 'world-flags',
    title: 'World Flags',
    description:
      'Flag on the front. Country, capital, population, and a close subregion map on the back.',
    kind: 'flag-fact',
    cards: worldFlags as FlagCard[],
  },
  {
    id: 'uk-monarchs',
    title: 'UK / English Monarchs',
    description:
      'From Alfred the Great to Charles III. Study name or reign first; the other side has a portrait and highlights.',
    kind: 'monarch-dual',
    cards: ukMonarchs as MonarchCard[],
  },
  {
    id: 'us-presidents',
    title: 'US Presidents',
    description:
      'Name and portrait on the front. Terms, vice president, party, and a few highlights on the back.',
    kind: 'president-fact',
    cards: usPresidents as PresidentCard[],
  },
]

export function getSetsByIds(ids: FlashcardSetId[]): FlashcardSet[] {
  const wanted = new Set(ids)
  return flashcardSets.filter((set) => wanted.has(set.id))
}

export function setNeedsMonarchPrompt(ids: FlashcardSetId[]): boolean {
  return getSetsByIds(ids).some((set) => set.kind === 'monarch-dual')
}
