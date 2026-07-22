export type FlagCard = {
  id: string
  ccn3: string
  name: string
  capital: string
  population: number
  region: string
  subregion: string
  lat: number
  lng: number
  flag: string
}

export type MonarchCard = {
  id: string
  name: string
  reign: string
  house: string
  highlights: string[]
  image: string
}

export type PresidentCard = {
  id: string
  name: string
  terms: string
  vicePresidents: string
  party: string
  highlights: string[]
  image: string
}

export type RiichiTermCard = {
  kind: 'term'
  id: string
  term: string
  definition: string
  category: string
}

export type RiichiScoreCard = {
  kind: 'score'
  id: string
  situation: string
  answer: string
  category: string
}

export type RiichiGlyphCard = {
  kind: 'glyph'
  id: string
  display: string
  font: 'serif' | 'mincho' | 'brush'
  styleLabel: string
  answer: string
  answerDetail: string
  category: string
}

export type RiichiCard = RiichiTermCard | RiichiScoreCard | RiichiGlyphCard

export type MonarchPrompt = 'name' | 'reign'
export type RiichiTermPrompt = 'term' | 'definition'

export type FlashcardSetId =
  | 'world-flags'
  | 'uk-monarchs'
  | 'us-presidents'
  | 'riichi-mahjong'

export type FlashcardSetKind =
  | 'flag-fact'
  | 'monarch-dual'
  | 'president-fact'
  | 'riichi-mahjong'

export type FlashcardSet<T = unknown> = {
  id: FlashcardSetId
  title: string
  description: string
  kind: FlashcardSetKind
  cards: T[]
}

export type StudyOptions = {
  monarchPrompt: 'name' | 'reign' | 'mix'
  riichiTermPrompt: 'term' | 'definition' | 'mix'
}

export type StudyCard =
  | {
      key: string
      setId: FlashcardSetId
      setTitle: string
      kind: 'flag-fact'
      payload: FlagCard
    }
  | {
      key: string
      setId: FlashcardSetId
      setTitle: string
      kind: 'monarch-dual'
      payload: MonarchCard
      prompt: MonarchPrompt
    }
  | {
      key: string
      setId: FlashcardSetId
      setTitle: string
      kind: 'president-fact'
      payload: PresidentCard
    }
  | {
      key: string
      setId: FlashcardSetId
      setTitle: string
      kind: 'riichi-term'
      payload: RiichiTermCard
      prompt: RiichiTermPrompt
    }
  | {
      key: string
      setId: FlashcardSetId
      setTitle: string
      kind: 'riichi-score'
      payload: RiichiScoreCard
    }
  | {
      key: string
      setId: FlashcardSetId
      setTitle: string
      kind: 'riichi-glyph'
      payload: RiichiGlyphCard
    }
