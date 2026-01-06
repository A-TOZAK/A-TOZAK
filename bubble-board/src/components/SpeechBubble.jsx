import { useState, useRef } from 'react'

const COLORS = [
  { name: '青', class: 'bg-blue-200', value: 'blue' },
  { name: '緑', class: 'bg-green-200', value: 'green' },
  { name: '黄', class: 'bg-yellow-200', value: 'yellow' },
  { name: 'ピンク', class: 'bg-pink-200', value: 'pink' },
  { name: 'オレンジ', class: 'bg-orange-200', value: 'orange' },
]

function SpeechBubble({
  bubble,
  onUpdate,
  onDelete,
  onLike,
  isOwner,
  onDragStart,
  onDrag,
  onDragEnd
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(bubble.text)
  const [editColor, setEditColor] = useState(bubble.color)
  const bubbleRef = useRef(null)

  const handleEdit = () => {
    if (isOwner) {
      setIsEditing(true)
    }
  }

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(bubble.id, { text: editText, color: editColor })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditText(bubble.text)
    setEditColor(bubble.color)
    setIsEditing(false)
  }

  const colorClass = COLORS.find(c => c.value === bubble.color)?.class || 'bg-blue-200'

  const handleMouseDown = (e) => {
    if (!isEditing && e.target === bubbleRef.current) {
      onDragStart(bubble.id, e)
    }
  }

  return (
    <div
      ref={bubbleRef}
      className={`absolute ${colorClass} rounded-2xl shadow-lg p-4 cursor-move min-w-[200px] max-w-[300px] transition-transform hover:scale-105`}
      style={{
        left: `${bubble.position.x}px`,
        top: `${bubble.position.y}px`,
        zIndex: bubble.isDragging ? 50 : 10
      }}
      onMouseDown={handleMouseDown}
    >
      {isEditing ? (
        <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            autoFocus
          />
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setEditColor(color.value)}
                className={`${color.class} w-8 h-8 rounded-full border-2 ${
                  editColor === color.value ? 'border-gray-800' : 'border-gray-300'
                }`}
                title={color.name}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition"
            >
              保存
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium transition"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-800 whitespace-pre-wrap break-words mb-3">
            {bubble.text}
          </p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium">{bubble.author}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onLike(bubble.id)
                }}
                className="flex items-center gap-1 bg-white hover:bg-gray-100 px-3 py-1 rounded-full transition"
              >
                <span>❤️</span>
                <span className="font-semibold">{bubble.likes || 0}</span>
              </button>
              {isOwner && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit()
                    }}
                    className="bg-white hover:bg-gray-100 px-3 py-1 rounded-full transition"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(bubble.id)
                    }}
                    className="bg-white hover:bg-gray-100 px-3 py-1 rounded-full transition"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SpeechBubble
export { COLORS }
