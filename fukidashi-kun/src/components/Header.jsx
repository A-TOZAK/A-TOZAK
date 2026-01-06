import { useState } from 'react'

function Header({ boardId, shareUrl, currentPage, setCurrentPage }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">ふきだしくん</h1>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm w-64 text-gray-600"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition"
            >
              {copied ? 'コピー済み!' : 'URLコピー'}
            </button>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ページ {page}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

export default Header
