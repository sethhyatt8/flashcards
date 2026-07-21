import type { PresidentCard } from '../types'

type PresidentFacesProps = {
  card: PresidentCard
}

export function PresidentFront({ card }: PresidentFacesProps) {
  return (
    <div className="president-front">
      {card.image ? (
        <img className="president-portrait" src={card.image} alt="" />
      ) : (
        <div className="president-portrait is-empty">No portrait</div>
      )}
      <p className="president-name">{card.name}</p>
    </div>
  )
}

export function PresidentBack({ card }: PresidentFacesProps) {
  return (
    <div className="president-back">
      <div className="fact">
        <span className="fact-label">Term{card.terms.includes(';') ? 's' : ''}</span>
        <span className="fact-value">{card.terms}</span>
      </div>
      <div className="fact">
        <span className="fact-label">
          Vice President{card.vicePresidents.includes(';') ? 's' : ''}
        </span>
        <span className="fact-value">{card.vicePresidents}</span>
      </div>
      <div className="fact">
        <span className="fact-label">Party</span>
        <span className="fact-value">{card.party}</span>
      </div>
      <ul className="president-highlights">
        {card.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
