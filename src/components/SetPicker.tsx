import type { FlashcardSet, FlashcardSetId, StudyOptions } from '../types'
import { setNeedsMonarchPrompt, setNeedsRiichiTermPrompt } from '../sets'

type SetPickerProps = {
  sets: FlashcardSet[]
  selected: FlashcardSetId[]
  onChange: (ids: FlashcardSetId[]) => void
  monarchPrompt: StudyOptions['monarchPrompt']
  onMonarchPromptChange: (value: StudyOptions['monarchPrompt']) => void
  riichiTermPrompt: StudyOptions['riichiTermPrompt']
  onRiichiTermPromptChange: (value: StudyOptions['riichiTermPrompt']) => void
  onStart: () => void
}

export function SetPicker({
  sets,
  selected,
  onChange,
  monarchPrompt,
  onMonarchPromptChange,
  riichiTermPrompt,
  onRiichiTermPromptChange,
  onStart,
}: SetPickerProps) {
  const selectedSet = new Set(selected)
  const canStart = selected.length > 0
  const showMonarchPrompt = setNeedsMonarchPrompt(selected)
  const showRiichiTermPrompt = setNeedsRiichiTermPrompt(selected)

  function toggle(id: FlashcardSetId) {
    if (selectedSet.has(id)) {
      onChange(selected.filter((item) => item !== id))
      return
    }
    onChange([...selected, id])
  }

  return (
    <div className="picker">
      <header className="picker-header">
        <p className="brand">Flashcards</p>
        <h1>Choose a set</h1>
        <p className="lede">
          Pick one or more sets, then study a shuffled run. Tap a card to flip;
          tap again to move on.
        </p>
      </header>

      <ul className="set-list">
        {sets.map((set) => {
          const checked = selectedSet.has(set.id)
          return (
            <li key={set.id}>
              <label className={checked ? 'set-option is-selected' : 'set-option'}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(set.id)}
                />
                <span className="set-copy">
                  <span className="set-title">{set.title}</span>
                  <span className="set-meta">
                    {set.cards.length} cards · {set.description}
                  </span>
                </span>
              </label>
            </li>
          )
        })}
      </ul>

      {showMonarchPrompt && (
        <fieldset className="prompt-options">
          <legend>Monarch cards — show first</legend>
          <label>
            <input
              type="radio"
              name="monarch-prompt"
              checked={monarchPrompt === 'mix'}
              onChange={() => onMonarchPromptChange('mix')}
            />
            Mix (random each card)
          </label>
          <label>
            <input
              type="radio"
              name="monarch-prompt"
              checked={monarchPrompt === 'name'}
              onChange={() => onMonarchPromptChange('name')}
            />
            Name first
          </label>
          <label>
            <input
              type="radio"
              name="monarch-prompt"
              checked={monarchPrompt === 'reign'}
              onChange={() => onMonarchPromptChange('reign')}
            />
            Reign first
          </label>
        </fieldset>
      )}

      {showRiichiTermPrompt && (
        <fieldset className="prompt-options">
          <legend>Riichi terms — show first</legend>
          <label>
            <input
              type="radio"
              name="riichi-term-prompt"
              checked={riichiTermPrompt === 'mix'}
              onChange={() => onRiichiTermPromptChange('mix')}
            />
            Mix (random each card)
          </label>
          <label>
            <input
              type="radio"
              name="riichi-term-prompt"
              checked={riichiTermPrompt === 'term'}
              onChange={() => onRiichiTermPromptChange('term')}
            />
            Term first
          </label>
          <label>
            <input
              type="radio"
              name="riichi-term-prompt"
              checked={riichiTermPrompt === 'definition'}
              onChange={() => onRiichiTermPromptChange('definition')}
            />
            Definition first
          </label>
          <p className="prompt-note">
            Scoring and glyph cards always show the prompt first (situation or
            symbol).
          </p>
        </fieldset>
      )}

      <button
        type="button"
        className="primary-btn"
        disabled={!canStart}
        onClick={onStart}
      >
        Start studying
      </button>
    </div>
  )
}
