import type {
  RiichiGlyphCard,
  RiichiScoreCard,
  RiichiTermCard,
  RiichiTermPrompt,
} from '../types'

type RiichiTermFacesProps = {
  card: RiichiTermCard
  prompt: RiichiTermPrompt
}

export function RiichiTermFront({ card, prompt }: RiichiTermFacesProps) {
  return (
    <div className="text-front">
      <p className="prompt-label">{prompt === 'term' ? 'Term' : 'Definition'}</p>
      <p className={prompt === 'term' ? 'prompt-value' : 'prompt-definition'}>
        {prompt === 'term' ? card.term : card.definition}
      </p>
      <p className="category-chip">{card.category}</p>
    </div>
  )
}

export function RiichiTermBack({ card, prompt }: RiichiTermFacesProps) {
  const answer = prompt === 'term' ? card.definition : card.term
  const answerLabel = prompt === 'term' ? 'Definition' : 'Term'

  return (
    <div className="text-back">
      <p className="prompt-label">{answerLabel}</p>
      <p className={prompt === 'term' ? 'prompt-definition' : 'prompt-value'}>
        {answer}
      </p>
      <p className="category-chip">{card.category}</p>
    </div>
  )
}

type RiichiScoreFacesProps = {
  card: RiichiScoreCard
}

export function RiichiScoreFront({ card }: RiichiScoreFacesProps) {
  return (
    <div className="text-front">
      <p className="prompt-label">Situation</p>
      <p className="prompt-value">{card.situation}</p>
      <p className="category-chip">{card.category}</p>
    </div>
  )
}

export function RiichiScoreBack({ card }: RiichiScoreFacesProps) {
  return (
    <div className="text-back">
      <p className="prompt-label">Score</p>
      <p className="prompt-definition">{card.answer}</p>
      <p className="category-chip">{card.category}</p>
    </div>
  )
}

type RiichiGlyphFacesProps = {
  card: RiichiGlyphCard
}

export function RiichiGlyphFront({ card }: RiichiGlyphFacesProps) {
  return (
    <div className="glyph-front">
      <p className={`glyph-symbol font-${card.font}`}>{card.display}</p>
      <p className="category-chip">{card.styleLabel}</p>
    </div>
  )
}

export function RiichiGlyphBack({ card }: RiichiGlyphFacesProps) {
  return (
    <div className="text-back">
      <p className="prompt-label">Answer</p>
      <p className="prompt-value">{card.answer}</p>
      <p className="prompt-definition">{card.answerDetail}</p>
      <p className="category-chip">{card.category}</p>
    </div>
  )
}
