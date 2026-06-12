import { useState } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'

export default function DrawingTools({
  drawingManager,
  onUndo,
  onRedo,
  onClear,
  onSave,
  onExport,
  isSaving,
}) {
  const [tool, setTool] = useState('draw')
  const [color, setColor] = useState('#000000')
  const [size, setSize] = useState(2)
  const [showStickerPicker, setShowStickerPicker] = useState(false)

  const stickers = ['😊', '❤️', '⭐', '✨', '🌟', '💭', '🎨', '📝']

  const handleToolChange = (newTool) => {
    setTool(newTool)
    if (drawingManager) {
      drawingManager.setTool(newTool)
    }
  }

  const handleColorChange = (newColor) => {
    setColor(newColor)
    if (drawingManager) {
      drawingManager.setColor(newColor)
    }
  }

  const handleSizeChange = (newSize) => {
    setSize(newSize)
    if (drawingManager) {
      drawingManager.setSize(newSize)
    }
  }

  const handleStickerClick = (emoji) => {
    if (drawingManager) {
      const canvas = drawingManager.canvas
      const rect = canvas.getBoundingClientRect()
      const x = rect.width / 2
      const y = rect.height / 2
      drawingManager.addSticker(emoji, x, y)
    }
    setShowStickerPicker(false)
  }

  return (
    <div className="space-y-4">
      {/* Tool Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => handleToolChange('draw')}
          className={`px-3 py-2 rounded-lg font-medium transition ${
            tool === 'draw'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🖍️ Draw
        </button>
        <button
          onClick={() => handleToolChange('highlighter')}
          className={`px-3 py-2 rounded-lg font-medium transition ${
            tool === 'highlighter'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🔆 Highlight
        </button>
        <button
          onClick={() => handleToolChange('eraser')}
          className={`px-3 py-2 rounded-lg font-medium transition ${
            tool === 'eraser'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🧹 Eraser
        </button>
        <div className="relative">
          <button
            onClick={() => setShowStickerPicker(!showStickerPicker)}
            className="w-full px-3 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            ✨ Sticker
          </button>
          
          {/* Sticker Picker */}
          {showStickerPicker && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-2 grid grid-cols-4 gap-1 z-20">
              {stickers.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => handleStickerClick(emoji)}
                  className="text-2xl p-2 hover:bg-gray-100 rounded transition"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Color Picker (only for draw tool) */}
      {tool === 'draw' && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
          />
          <div className="flex gap-1">
            {['#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'].map(
              (c) => (
                <button
                  key={c}
                  onClick={() => handleColorChange(c)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    color === c ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: c }}
                />
              )
            )}
          </div>
        </div>
      )}

      {/* Brush Size */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Size:</label>
        <input
          type="range"
          min="1"
          max="50"
          value={size}
          onChange={(e) => handleSizeChange(parseInt(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm font-medium text-gray-700 w-8">{size}px</span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={onUndo}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          ↶ Undo
        </button>
        <button
          onClick={onRedo}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          ↷ Redo
        </button>
        <button
          onClick={onClear}
          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition"
        >
          ✕ Clear
        </button>
        <button
          onClick={onExport}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          ⬇️ Export
        </button>
      </div>

      {/* Save Button */}
      <button
        onClick={onSave}
        disabled={isSaving}
        className="w-full px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSaving ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <span>💾</span>
            <span>Save Drawing</span>
          </>
        )}
      </button>
    </div>
  )
}
