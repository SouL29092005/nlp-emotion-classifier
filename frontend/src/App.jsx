import { useMemo, useState } from 'react'
import './App.css'

const sampleTexts = [
  {
    label: 'Joy',
    text: 'I am so happy and grateful for the support I received today.',
  },
  {
    label: 'Sadness',
    text: 'I feel exhausted and empty after a long day with no comfort.',
  },
  {
    label: 'Anger',
    text: 'This situation made me furious and unable to stay calm.',
  },
  {
    label: 'Fear',
    text: 'I am anxious and worried about what might happen next.',
  },
  {
    label: 'Love',
    text: 'I feel deeply connected and cared for in this moment.',
  },
]

const emotionMeta = {
  joy: {
    emoji: '😊',
    title: 'Joy',
    label: 'Positive energy',
    accent: '#facc15',
    text: 'The message sounds cheerful, optimistic, and full of warmth.',
  },
  sadness: {
    emoji: '😢',
    title: 'Sadness',
    label: 'Low mood',
    accent: '#60a5fa',
    text: 'The sentence reflects emotional pain, heaviness, or loneliness.',
  },
  anger: {
    emoji: '😠',
    title: 'Anger',
    label: 'Frustration',
    accent: '#f97316',
    text: 'The text conveys irritation, resentment, or strong emotional tension.',
  },
  fear: {
    emoji: '😨',
    title: 'Fear',
    label: 'Anxiety',
    accent: '#a78bfa',
    text: 'This tone suggests worry, vulnerability, or threat.',
  },
  love: {
    emoji: '💖',
    title: 'Love',
    label: 'Affection',
    accent: '#f472b6',
    text: 'The message shows care, affection, and emotional closeness.',
  },
  surprise: {
    emoji: '😮',
    title: 'Surprise',
    label: 'Unexpected reaction',
    accent: '#34d399',
    text: 'This wording suggests astonishment or a sudden emotional shift.',
  },
}

function App() {
  const [text, setText] = useState(
    'I feel excited and hopeful after hearing the good news today.',
  )
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const activeEmotion = useMemo(() => {
    if (!result) return null
    return emotionMeta[result] || {
      emoji: '✨',
      title: result,
      label: 'Detected emotion',
      accent: '#8b5cf6',
      text: 'The system identified an emotional tone from this sentence.',
    }
  }, [result])

  const analyzeText = async () => {
    if (!text.trim()) {
      setError('Please enter a sentence to analyze.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'The model could not classify this text.')
      }

      setResult(data.emotion)
    } catch (err) {
      setError(
        err.message ||
          'The backend is not responding. Start the Flask server on port 5000.',
      )
    } finally {
      setLoading(false)
    }
  }

  const clearInput = () => {
    setText('')
    setError('')
    setResult(null)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-group">
          <div className="brand-mark">AI</div>
          <div>
            <p className="eyebrow">Emotion intelligence</p>
            <h1>Sentiment Lens</h1>
          </div>
        </div>
        <span className="status-pill">Live ML model</span>
      </header>

      <main className="dashboard">
        <section className="panel input-panel">
          <div className="panel-header">
            <p className="eyebrow">Text analysis</p>
            <h2>Detect the feeling behind the words</h2>
          </div>

          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Type a sentence to understand how it feels..."
            rows={8}
          />

          <div className="action-row">
            <button type="button" className="primary-btn" onClick={analyzeText} disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze emotion'}
            </button>
            <button type="button" className="secondary-btn" onClick={clearInput}>
              Clear
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="sample-group">
            <p className="sample-label">Quick samples</p>
            <div className="sample-list">
              {sampleTexts.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  className="sample-btn"
                  onClick={() => {
                    setText(sample.text)
                    setError('')
                    setResult(null)
                  }}
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="panel result-panel">
          <div className="panel-header">
            <p className="eyebrow">Prediction</p>
            <h2>Detected emotion</h2>
          </div>

          {activeEmotion ? (
            <div className="result-card" style={{ '--emotion-accent': activeEmotion.accent }}>
              <div className="emotion-badge">{activeEmotion.emoji}</div>
              <div className="result-content">
                <span className="emotion-tag">{activeEmotion.label}</span>
                <h3>{activeEmotion.title}</h3>
                <p>{activeEmotion.text}</p>
              </div>
            </div>
          ) : (
            <div className="placeholder-box">
              <div className="placeholder-emoji">✨</div>
              <p>
                Your result will appear here after you analyze a sentence.
              </p>
            </div>
          )}

          <div className="insight-list">
            <div>
              <span>Model</span>
              <strong>Logistic Regression</strong>
            </div>
            <div>
              <span>Features</span>
              <strong>TF-IDF text analysis</strong>
            </div>
            <div>
              <span>Output</span>
              <strong>Joy / Fear / Love / Anger / Sadness / Surprise</strong>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App
