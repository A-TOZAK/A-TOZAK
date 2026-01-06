import { useState, useEffect, useRef } from 'react'
import SpeechBubble from './SpeechBubble'
import CreateBubbleModal from './CreateBubbleModal'

function Board({ boardId, userName, currentPage }) {
  const [bubbles, setBubbles] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [draggingId, setDraggingId] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const boardRef = useRef(null)

  const storageKey = `${boardId}-page-${currentPage}`

  // ストレージからデータを読み込む
  const loadBubbles = () => {
    try {
      if (window.storage) {
        window.storage.getItem(storageKey, { shared: true }).then(data => {
          if (data) {
            setBubbles(JSON.parse(data))
          }
        })
      } else {
        const data = localStorage.getItem(storageKey)
        if (data) {
          setBubbles(JSON.parse(data))
        }
      }
    } catch (error) {
      console.error('Failed to load bubbles:', error)
    }
  }

  // ストレージにデータを保存する
  const saveBubbles = (newBubbles) => {
    try {
      const data = JSON.stringify(newBubbles)
      if (window.storage) {
        window.storage.setItem(storageKey, data, { shared: true })
      } else {
        localStorage.setItem(storageKey, data)
      }
    } catch (error) {
      console.error('Failed to save bubbles:', error)
    }
  }

  // 初回読み込みとページ切り替え時
  useEffect(() => {
    loadBubbles()
  }, [boardId, currentPage])

  // 定期的にポーリング
  useEffect(() => {
    const interval = setInterval(() => {
      loadBubbles()
    }, 1000)
    return () => clearInterval(interval)
  }, [boardId, currentPage])

  const handleCreate = (text, color) => {
    const newBubble = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: userName,
      text,
      color,
      position: { x: 100, y: 100 },
      likes: 0,
      timestamp: Date.now(),
    }
    const newBubbles = [...bubbles, newBubble]
    setBubbles(newBubbles)
    saveBubbles(newBubbles)
    setShowModal(false)
  }

  const handleUpdate = (id, updates) => {
    const newBubbles = bubbles.map((b) =>
      b.id === id ? { ...b, ...updates } : b
    )
    setBubbles(newBubbles)
    saveBubbles(newBubbles)
  }

  const handleDelete = (id) => {
    const newBubbles = bubbles.filter((b) => b.id !== id)
    setBubbles(newBubbles)
    saveBubbles(newBubbles)
  }

  const handleLike = (id) => {
    const newBubbles = bubbles.map((b) =>
      b.id === id ? { ...b, likes: (b.likes || 0) + 1 } : b
    )
    setBubbles(newBubbles)
    saveBubbles(newBubbles)
  }

  const handleDragStart = (id, e) => {
    const bubble = bubbles.find(b => b.id === id)
    if (bubble) {
      setDraggingId(id)
      const rect = e.currentTarget.getBoundingClientRect()
      const boardRect = boardRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })

      // ドラッグ中のフラグを設定
      handleUpdate(id, { isDragging: true })
    }
  }

  const handleDrag = (e) => {
    if (draggingId && boardRef.current) {
      const boardRect = boardRef.current.getBoundingClientRect()
      const newX = e.clientX - boardRect.left - dragOffset.x
      const newY = e.clientY - boardRect.top - dragOffset.y

      const newBubbles = bubbles.map(b =>
        b.id === draggingId
          ? { ...b, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
          : b
      )
      setBubbles(newBubbles)
    }
  }

  const handleDragEnd = () => {
    if (draggingId) {
      // ドラッグ中のフラグを解除
      const newBubbles = bubbles.map(b =>
        b.id === draggingId ? { ...b, isDragging: false } : b
      )
      setBubbles(newBubbles)
      saveBubbles(newBubbles)
      setDraggingId(null)
    }
  }

  useEffect(() => {
    if (draggingId) {
      const handleMouseMove = (e) => handleDrag(e)
      const handleMouseUp = () => handleDragEnd()

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)

      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [draggingId, dragOffset])

  return (
    <div className="relative">
      <div
        ref={boardRef}
        className="relative min-h-[calc(100vh-180px)] bg-white m-4 rounded-lg shadow-inner"
        style={{ height: 'calc(100vh - 180px)' }}
      >
        {bubbles.map((bubble) => (
          <SpeechBubble
            key={bubble.id}
            bubble={bubble}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onLike={handleLike}
            isOwner={bubble.author === userName}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg text-3xl font-bold transition transform hover:scale-110 z-50"
      >
        +
      </button>

      {showModal && (
        <CreateBubbleModal
          onCreate={handleCreate}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default Board
