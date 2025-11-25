import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Play.css";

interface ScratchArea {
  id: number;
  revealed: boolean;
  value: string;
  isWinning: boolean;
}

function Play() {
  const navigate = useNavigate();

  const [scratchAreas, setScratchAreas] = useState<ScratchArea[]>(() => {
    const symbols = ["⚽", "🏆", "🥅", "👕", "🏟️"];
    const areas: ScratchArea[] = [];
    const winningSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const isGameWinner = Math.random() < 0.3;

    for (let i = 0; i < 9; i++) {
      const isWinningArea = isGameWinner && (i === 0 || i === 4 || i === 8);
      areas.push({
        id: i,
        revealed: false,
        value: isWinningArea
          ? winningSymbol
          : symbols[Math.floor(Math.random() * symbols.length)],
        isWinning: isWinningArea,
      });
    }
    return areas;
  });
  const [gameComplete, setGameComplete] = useState(false);
  const [isWinner, setIsWinner] = useState(() => Math.random() < 0.3);
  const [winAmount, setWinAmount] = useState(() => {
    const prizes = ["₦1,000", "₦5,000", "₦10,000", "₦25,000", "₦50,000"];
    const isGameWinner = Math.random() < 0.3;
    return isGameWinner
      ? parseInt(
          prizes[Math.floor(Math.random() * prizes.length)]
            .replace("₦", "")
            .replace(",", "")
        )
      : 0;
  });
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [isScratching, setIsScratching] = useState(false);

  const initializeGame = () => {
    const prizes = ["₦1,000", "₦5,000", "₦10,000", "₦25,000", "₦50,000"];
    const symbols = ["⚽", "🏆", "🥅", "👕", "🏟️"];
    const areas: ScratchArea[] = [];
    const winningSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const isGameWinner = Math.random() < 0.3;

    for (let i = 0; i < 9; i++) {
      const isWinningArea = isGameWinner && (i === 0 || i === 4 || i === 8);
      areas.push({
        id: i,
        revealed: false,
        value: isWinningArea
          ? winningSymbol
          : symbols[Math.floor(Math.random() * symbols.length)],
        isWinning: isWinningArea,
      });
    }

    setScratchAreas(areas);
    setIsWinner(isGameWinner);
    setWinAmount(
      isGameWinner
        ? parseInt(
            prizes[Math.floor(Math.random() * prizes.length)]
              .replace("₦", "")
              .replace(",", "")
          )
        : 0
    );
    setGameComplete(false);
  };

  const initCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 100;
    canvas.height = 100;

    ctx.fillStyle = "#silver";
    ctx.fillRect(0, 0, 100, 100);

    ctx.fillStyle = "#999";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Scratch Here", 50, 55);
  };

  const handleScratch = (e: React.MouseEvent, index: number) => {
    if (scratchAreas[index].revealed || gameComplete) return;

    const canvas = canvasRefs.current[index];
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.fill();

    setTimeout(() => {
      setScratchAreas((prev) => {
        const newAreas = prev.map((area) =>
          area.id === index ? { ...area, revealed: true } : area
        );
        const revealedCount = newAreas.filter((area) => area.revealed).length;
        if (revealedCount >= 3) {
          const revealedAreas = newAreas.filter((area) => area.revealed);
          const symbolCounts: { [key: string]: number } = {};
          revealedAreas.forEach((area: ScratchArea) => {
            symbolCounts[area.value] = (symbolCounts[area.value] || 0) + 1;
          });
          const hasThreeMatching = Object.values(symbolCounts).some(
            (count) => count >= 3
          );
          setIsWinner(hasThreeMatching);
          setWinAmount(
            hasThreeMatching
              ? parseInt(
                  ["₦1,000", "₦5,000", "₦10,000", "₦25,000", "₦50,000"][
                    Math.floor(Math.random() * 5)
                  ]
                    .replace("₦", "")
                    .replace(",", "")
                )
              : 0
          );
          setGameComplete(true);
        }
        return newAreas;
      });
    }, 100);
  };

  const handleMouseDown = () => setIsScratching(true);
  const handleMouseUp = () => setIsScratching(false);

  useEffect(() => {
    canvasRefs.current.forEach((canvas, index) => {
      if (canvas && !scratchAreas[index]?.revealed) {
        initCanvas(canvas);
      }
    });
  }, [scratchAreas]);

  return (
    <div className="play-container">
      <div className="game-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h2>Lucky World Cup</h2>
        <div className="balance">Balance: ₦10,000</div>
      </div>

      <div className="game-board">
        <div className="instructions">
          <p>Scratch 3 areas to reveal symbols. Match 3 symbols to win!</p>
        </div>

        <div className="scratch-grid">
          {scratchAreas.map((area, index) => (
            <div key={area.id} className="scratch-area">
              {area.revealed ? (
                <div className={`symbol ${area.isWinning ? "winning" : ""}`}>
                  {area.value}
                </div>
              ) : (
                <canvas
                  ref={(el) => {
                    canvasRefs.current[index] = el;
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseMove={
                    isScratching ? (e) => handleScratch(e, index) : undefined
                  }
                  onClick={(e) => handleScratch(e, index)}
                  style={{ cursor: gameComplete ? "not-allowed" : "pointer" }}
                />
              )}
            </div>
          ))}
        </div>

        {gameComplete && (
          <div className={`result ${isWinner ? "winner" : "loser"}`}>
            {isWinner ? (
              <>
                <h3>🎉 Congratulations! 🎉</h3>
                <p>You won ₦{winAmount.toLocaleString()}!</p>
              </>
            ) : (
              <>
                <h3>Better luck next time!</h3>
                <p>No matching symbols found.</p>
              </>
            )}
            <button className="play-again-btn" onClick={initializeGame}>
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Play;
