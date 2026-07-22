import { useState } from 'react'
import { SetPicker } from './components/SetPicker'
import { StudySession } from './components/StudySession'
import { buildDeck } from './lib/deck'
import { flashcardSets, getSetsByIds } from './sets'
import type { FlashcardSetId, StudyCard, StudyOptions } from './types'
import './App.css'

function App() {
  const [selected, setSelected] = useState<FlashcardSetId[]>(['riichi-mahjong'])
  const [monarchPrompt, setMonarchPrompt] =
    useState<StudyOptions['monarchPrompt']>('mix')
  const [riichiTermPrompt, setRiichiTermPrompt] =
    useState<StudyOptions['riichiTermPrompt']>('mix')
  const [deck, setDeck] = useState<StudyCard[] | null>(null)

  function start() {
    const sets = getSetsByIds(selected)
    setDeck(buildDeck(sets, { monarchPrompt, riichiTermPrompt }))
  }

  function exit() {
    setDeck(null)
  }

  return (
    <div className="app-shell">
      {deck ? (
        <StudySession deck={deck} onExit={exit} onRestart={start} />
      ) : (
        <SetPicker
          sets={flashcardSets}
          selected={selected}
          onChange={setSelected}
          monarchPrompt={monarchPrompt}
          onMonarchPromptChange={setMonarchPrompt}
          riichiTermPrompt={riichiTermPrompt}
          onRiichiTermPromptChange={setRiichiTermPrompt}
          onStart={start}
        />
      )}
    </div>
  )
}

export default App
