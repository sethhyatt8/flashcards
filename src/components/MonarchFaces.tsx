import type { MonarchCard, MonarchPrompt } from '../types'
import { PortraitImage } from './PortraitImage'

type MonarchFacesProps = {
  card: MonarchCard
  prompt: MonarchPrompt
}

export function MonarchFront({ card, prompt }: MonarchFacesProps) {
  return (
    <div className="monarch-front">
      <p className="prompt-label">{prompt === 'name' ? 'Name' : 'Reign'}</p>
      <p className="prompt-value">
        {prompt === 'name' ? card.name : card.reign}
      </p>
    </div>
  )
}

export function MonarchBack({ card, prompt }: MonarchFacesProps) {
  const answer = prompt === 'name' ? card.reign : card.name
  const answerLabel = prompt === 'name' ? 'Reign' : 'Name'

  return (
    <div className="monarch-back">
      {card.image ? (
        <PortraitImage
          folder="monarchs"
          id={card.id}
          remote={card.image}
          className="monarch-portrait"
          alt=""
        />
      ) : (
        <div className="monarch-portrait is-empty">No portrait</div>
      )}
      <p className="monarch-answer-label">{answerLabel}</p>
      <p className="monarch-answer">{answer}</p>
      <p className="monarch-house">{card.house}</p>
      <ul className="monarch-highlights">
        {card.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
