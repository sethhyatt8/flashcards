import { useEffect, useState, type KeyboardEvent } from 'react'
import { formatPopulation } from '../lib/deck'
import type { StudyCard } from '../types'
import { MonarchBack, MonarchFront } from './MonarchFaces'
import { RegionMap } from './RegionMap'

type StudySessionProps = {
  deck: StudyCard[]
  onExit: () => void
  onRestart: () => void
}

export function StudySession({ deck, onExit, onRestart }: StudySessionProps) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    setIndex(0)
    setFlipped(false)
    setFinished(false)
  }, [deck])

  const card = deck[index]
  const progress = finished ? deck.length : index
  const canGoBack = finished || flipped || index > 0

  function handleCardClick() {
    if (finished || !card) return

    if (!flipped) {
      setFlipped(true)
      return
    }

    const next = index + 1
    if (next >= deck.length) {
      setFinished(true)
      setFlipped(false)
      return
    }

    setFlipped(false)
    setIndex(next)
  }

  function handleBack() {
    if (finished) {
      setFinished(false)
      setIndex(deck.length - 1)
      setFlipped(true)
      return
    }

    if (flipped) {
      setFlipped(false)
      return
    }

    if (index > 0) {
      setIndex(index - 1)
      setFlipped(false)
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleCardClick()
    }
  }

  if (!card && !finished) {
    return (
      <div className="session">
        <p>No cards in the selected sets.</p>
        <button type="button" className="ghost-btn" onClick={onExit}>
          Back to sets
        </button>
      </div>
    )
  }

  return (
    <div className="session">
      <header className="session-bar">
        <button
          type="button"
          className="ghost-btn"
          onClick={handleBack}
          disabled={!canGoBack}
        >
          ← Back
        </button>
        <p className="progress">
          {finished ? 'Done' : `${progress + 1} / ${deck.length}`}
        </p>
        <button type="button" className="ghost-btn sets-btn" onClick={onExit}>
          Sets
        </button>
      </header>

      {finished ? (
        <div className="done-panel">
          <h2>Deck complete</h2>
          <p>You went through {deck.length} cards.</p>
          <div className="done-actions">
            <button type="button" className="primary-btn" onClick={onRestart}>
              Study again
            </button>
            <button type="button" className="ghost-btn" onClick={onExit}>
              Choose sets
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            key={card.key}
            className={flipped ? 'flashcard is-flipped' : 'flashcard'}
            onClick={handleCardClick}
            onKeyDown={onKeyDown}
            role="button"
            tabIndex={0}
            aria-label={flipped ? 'Show next card' : 'Flip card'}
          >
            <div className="flashcard-inner">
              <div className="face face-front">
                {card.kind === 'flag-fact' && (
                  <img
                    className="flag"
                    src={card.payload.flag}
                    alt=""
                    loading="eager"
                    decoding="async"
                  />
                )}
                {card.kind === 'monarch-dual' && (
                  <MonarchFront card={card.payload} prompt={card.prompt} />
                )}
              </div>
              <div className="face face-back">
                {card.kind === 'flag-fact' && (
                  <div className="fact-back">
                    <RegionMap card={card.payload} />
                    <div className="country">{card.payload.name}</div>
                    <div className="fact">
                      <span className="fact-label">Capital</span>
                      <span className="fact-value">{card.payload.capital}</span>
                    </div>
                    <div className="fact">
                      <span className="fact-label">Population</span>
                      <span className="fact-value">
                        {formatPopulation(card.payload.population)}
                      </span>
                    </div>
                  </div>
                )}
                {card.kind === 'monarch-dual' && (
                  <MonarchBack card={card.payload} prompt={card.prompt} />
                )}
              </div>
            </div>
          </div>
          <p className="hint">
            {flipped ? 'Click for the next card' : 'Click to flip'}
          </p>
        </>
      )}
    </div>
  )
}
