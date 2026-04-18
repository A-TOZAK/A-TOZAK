import { useState, useEffect } from 'react'
import Header from './components/Header'
import Board from './components/Board'
import NameInput from './components/NameInput'
import './App.css'

function App() {
  const [boardId, setBoardId] = useState('')
  const [userName, setUserName] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showNameInput, setShowNameInput] = useState(false)

  useEffect(() => {
    // URLハッシュからボードIDを取得、なければ新規作成
    let hash = window.location.hash.slice(1)
    if (!hash || !hash.startsWith('board-')) {
      hash = `board-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      window.location.hash = hash
    }
    setBoardId(hash)

    // ローカルストレージからユーザー名を取得
    const storedName = localStorage.getItem(`${hash}-userName`)
    if (!storedName) {
      setShowNameInput(true)
    } else {
      setUserName(storedName)
    }
  }, [])

  const handleNameSubmit = (name) => {
    const finalName = name.trim() || '匿名'
    setUserName(finalName)
    localStorage.setItem(`${boardId}-userName`, finalName)
    setShowNameInput(false)
  }

  const shareUrl = boardId ? `${window.location.origin}${window.location.pathname}#${boardId}` : ''

  if (showNameInput) {
    return <NameInput onSubmit={handleNameSubmit} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        boardId={boardId}
        shareUrl={shareUrl}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <Board
        boardId={boardId}
        userName={userName}
        currentPage={currentPage}
      />
    </div>
  )
}

export default App
