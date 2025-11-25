import './App.css'
import { useNavigate } from 'react-router-dom'

function App() {
  const navigate = useNavigate()
  return (
    <div className="app">
      <div className="game-card">
        <div className="card-header">
          <div className="game-icon">⚽</div>
          <h3>Lucky World Cup</h3>
        </div>
        <div className="card-content">
          <div className="game-image">
            <div className="trophy">🏆</div>
          </div>
          <div className="game-info">
            <p className="description">Win big with football predictions!</p>
            <div className="prize-info">
              <span className="prize">₦50,000</span>
              <span className="players">1,234 players</span>
            </div>
          </div>
        </div>
        <button className="play-button" onClick={() => navigate('/play')}>Play Now</button>
      </div>
    </div>
  )
}

export default App
