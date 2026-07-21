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

export type MonarchPrompt = 'name' | 'reign'

export type FlashcardSetId = 'world-flags' | 'uk-monarchs' | 'us-presidents'

export type FlashcardSetKind = 'flag-fact' | 'monarch-dual' | 'president-fact'

export type FlashcardSet<T = unknown> = {
  id: FlashcardSetId
  title: string
  description: string
  kind: FlashcardSetKind
  cards: T[]
}

export type StudyOptions = {
  /** For monarch-dual sets: which side is asked first. */
  monarchPrompt: 'name' | 'reign' | 'mix'
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
