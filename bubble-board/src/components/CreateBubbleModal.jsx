import { useState } from 'react'
import { COLORS } from './SpeechBubble'

function CreateBubbleModal({ onCreate, onClose }) {
  const [text, setText] = useState('')
  const [color, setColor] = useState('blue')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim()) {
      onCreate(text, color)
      setText('')
      setColor('blue')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          新しいふきだしを作成
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
              内容
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="意見を入力してください"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              required
              autoFocus
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              背景色
            </label>
            <div className="flex gap-3">
              {COLORS.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  onClick={() => setColor(colorOption.value)}
                  className={`${colorOption.class} w-12 h-12 rounded-full border-2 ${
                    color === colorOption.value ? 'border-gray-800 ring-2 ring-offset-2 ring-blue-500' : 'border-gray-300'
                  } transition transform hover:scale-110`}
                  title={colorOption.name}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
            >
              作成
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBubbleModal
