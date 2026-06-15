import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes sway {
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
  }
  @keyframes cloudmove {
    0% { transform: translateX(-10px); }
    100% { transform: translateX(10px); }
  }
  .hole-btn:hover:not(:disabled) {
    transform: scale(1.2) translateY(-4px) !important;
  }
`;

const HOLE_POSITIONS = [6, 18, 30, 42, 54, 66, 78];

export default function BinarySearch() {
    const navigate = useNavigate();
  const [secret, setSecret] = useState(null);
  const [low, setLow] = useState(1);
  const [high, setHigh] = useState(7);
  const [steps, setSteps] = useState(0);
  const [message, setMessage] = useState("Help the squirrel find the golden acorn hidden on the Quad!");
  const [eliminated, setEliminated] = useState([]);
  const [won, setWon] = useState(false);
  const [showLearn, setShowLearn] = useState(false);
  const [squirrelPos, setSquirrelPos] = useState(42);
  const [squirrelAnim, setSquirrelAnim] = useState("bounce");
  const [isMoving, setIsMoving] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [optimalPick, setOptimalPick] = useState(null);
  const [wasOptimal, setWasOptimal] = useState(null);

  useEffect(() => {
    fetch("https://algorithm-storybook.onrender.com/start")
      .then(res => res.json())
      .then(data => setSecret(data.secret));
  }, []);

  const handleGuess = async (hole) => {
    if (eliminated.includes(hole) || won || isMoving) return;
    setIsMoving(true);
    setSquirrelAnim("bounce");
    setSquirrelPos(HOLE_POSITIONS[hole - 1]);
    await new Promise(r => setTimeout(r, 800));
    setIsMoving(false);

    const res = await fetch("https://algorithm-storybook.onrender.com/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hole, secret, low, high, steps })
    });
    const data = await res.json();
    setSteps(data.steps);
    setOptimalPick(data.optimal_pick);
    setWasOptimal(data.optimal);

    if (data.result === "found") {
      setMessage(`Found the acorn in ${data.steps} steps!`);
      setWon(true);
      setLastResult("found");
      setSquirrelAnim("bounce");
    } else if (data.result === "higher") {
      setMessage(`🐇 The acorn is in a HIGHER numbered hole than ${hole}!`);
      setEliminated(e => [...e, ...Array.from({length: hole - low + 1}, (_, i) => low + i)]);
      setLow(data.new_low);
      setLastResult("wrong");
      setSquirrelAnim("shake");
      setTimeout(() => setSquirrelAnim("bounce"), 600);
    } else {
      setMessage(`🐇 The acorn is in a LOWER numbered hole than ${hole}!`);
      setEliminated(e => [...e, ...Array.from({length: high - hole + 1}, (_, i) => hole + i)]);
      setHigh(data.new_high);
      setLastResult("wrong");
      setSquirrelAnim("shake");
      setTimeout(() => setSquirrelAnim("bounce"), 600);
    }
  };

  const restart = () => {
    setLow(1); setHigh(7); setSteps(0);
    setEliminated([]); setWon(false); setLastResult(null);
    setSquirrelPos(42); setSquirrelAnim("bounce"); setIsMoving(false);
    setOptimalPick(null); setWasOptimal(null);
    setMessage("Help the squirrel find the golden acorn hidden on the Quad!");
    fetch("https://algorithm-storybook.onrender.com/start")
      .then(res => res.json())
      .then(data => setSecret(data.secret));
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Ubuntu', sans-serif", overflow: "hidden", position: "relative" }}>

        {/* SKY */}
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(180deg, #87CEEB 0%, #b8e0f7 40%, #4a7c2f 40%, #3a6b20 100%)", zIndex: 0 }} />

        {/* SUN */}
        <div style={{ position: "fixed", top: "40px", left: "60px", width: "70px", height: "70px", background: "radial-gradient(circle, #FFE566, #FFD700)", borderRadius: "50%", boxShadow: "0 0 40px rgba(255,215,0,0.6)", zIndex: 1 }} />

        {/* CLOUDS */}
        {[{top: 30, left: 200, w: 120}, {top: 55, left: 500, w: 90}, {top: 20, left: 800, w: 110}].map((c, i) => (
          <div key={i} style={{
            position: "fixed", top: `${c.top}px`, left: `${c.left}px`,
            width: `${c.w}px`, height: "40px",
            background: "rgba(255,255,255,0.9)", borderRadius: "40px",
            zIndex: 1, animation: `cloudmove ${3 + i}s ease-in-out infinite alternate`
          }} />
        ))}

        {[12, 84].map((left, i) => (
          <div key={i} style={{ position: "fixed", bottom: "45%", left: `${left}%`, zIndex: 4 }}>
            <div style={{ width: "90px", height: "90px", background: "radial-gradient(circle, #2d8a1e, #1a5c0f)", borderRadius: "50%", marginLeft: "-10px", animation: `sway ${2 + i}s ease-in-out infinite alternate` }} />
            <div style={{ width: "20px", height: "35px", background: "#8B5E3C", margin: "0 auto", borderRadius: "4px" }} />
          </div>
        ))}

        {/* GRASS PATH */}
        <div style={{ position: "fixed", bottom: "28%", left: "5%", right: "5%", height: "12px", background: "rgba(255,255,255,0.15)", borderRadius: "10px", zIndex: 2 }} />

        {/* Learn button */}
        <div style={{ position: "fixed", top: "16px", right: "16px", zIndex: 50 }}>
          <button onClick={() => setShowLearn(true)} style={{
            background: "#FF5F05", border: "none", color: "white",
            fontFamily: "'Ubuntu', sans-serif", fontSize: "0.85rem", fontWeight: "bold",
            padding: "10px 14px", borderRadius: "12px", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            display: "flex", alignItems: "center", gap: "6px"
          }}>🌰 Learn about this algorithm</button>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", padding: "20px 20px 8px", zIndex: 10, position: "relative" }}>
          <h1 style={{ color: "#FF5F05", fontSize: "2.5rem", margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>Acorn Hunt</h1>
          <p style={{ color: "#fff", fontSize: "0.95rem", margin: "4px 0 0", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>A Binary Search Adventure</p>
        </div>

        {/* Message box */}
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 20px", zIndex: 10, position: "relative" }}>
          <div style={{
            background: won ? "rgba(255,220,50,0.96)" : lastResult === "wrong" ? "rgba(255,100,100,0.95)" : "rgba(255,255,255,0.93)",
            borderRadius: "16px", padding: "14px 24px",
            maxWidth: "580px", width: "100%", textAlign: "center",
            boxShadow: "0 6px 24px rgba(0,0,0,0.25)", transition: "background 0.4s"
          }}>
            <p style={{ fontSize: "1.05rem", color: "#13294B", fontWeight: "bold", margin: 0, lineHeight: "1.6" }}>{message}</p>
            {won && steps <= 3 && <p style={{ color: "#FF5F05", fontWeight: "bold", margin: "8px 0 0" }}>Perfect binary search!</p>}
          </div>
        </div>

        {/* Educational hint box */}
        {optimalPick && !won && (
          <div style={{ display: "flex", justifyContent: "center", padding: "6px 20px", zIndex: 10, position: "relative" }}>
            <div style={{
              background: wasOptimal ? "rgba(50,180,80,0.92)" : "rgba(255,255,255,0.92)",
              borderRadius: "12px", padding: "10px 20px",
              maxWidth: "580px", width: "100%", textAlign: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)", transition: "background 0.4s"
            }}>
              {wasOptimal
                ? <p style={{ margin: 0, color: "white", fontWeight: "bold", fontSize: "0.95rem" }}>Nice! Hole {optimalPick} was the middle. That's exactly how binary search works. You cut the options in half!</p>
                : <p style={{ margin: 0, color: "#13294B", fontWeight: "bold", fontSize: "0.95rem" }}>Hole <strong>{optimalPick}</strong> was the middle of what's left. Picking the middle every time is the secret to binary search!</p>
              }
            </div>
          </div>
        )}

        {/* Steps */}
        <div style={{ textAlign: "center", zIndex: 10, position: "relative", margin: "6px 0" }}>
          <span style={{ background: "rgba(19,41,75,0.85)", color: "white", padding: "5px 18px", borderRadius: "20px", fontSize: "0.9rem" }}>
            Steps: <strong>{steps}</strong>
          </span>
        </div>

        {/* GAME SCENE */}
        <div style={{ position: "fixed", bottom: "28%", left: 0, right: 0, zIndex: 10 }}>

          {/* Squirrel */}
          <div style={{
            position: "absolute", bottom: "20px",
            left: `${squirrelPos}%`, transform: "translateX(-50%)",
            fontSize: "3rem",
            transition: "left 0.8s cubic-bezier(0.4,0,0.2,1)",
            animation: `${squirrelAnim} 0.8s ease-in-out infinite`,
            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
          }}>🐿️</div>

          {/* Holes */}
          <div style={{ display: "flex", justifyContent: "space-around", padding: "0 40px", alignItems: "flex-end" }}>
            {[1,2,3,4,5,6,7].map(hole => (
              <div key={hole} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <button
                  className="hole-btn"
                  onClick={() => handleGuess(hole)}
                  disabled={eliminated.includes(hole) || won || isMoving}
                  style={{
                    width: "58px", height: "58px", borderRadius: "50%",
                    fontSize: "1.3rem", fontWeight: "bold",
                    cursor: eliminated.includes(hole) || won || isMoving ? "not-allowed" : "pointer",
                    background: eliminated.includes(hole)
                      ? "rgba(80,80,80,0.6)"
                      : won && hole === secret
                      ? "linear-gradient(135deg, #FFD700, #FFA500)"
                      : "linear-gradient(135deg, #FF5F05, #cc4400)",
                    color: "white", border: "3px solid rgba(255,255,255,0.4)",
                    transition: "all 0.2s",
                    opacity: eliminated.includes(hole) ? 0.5 : 1,
                    boxShadow: eliminated.includes(hole) ? "none" : "0 4px 14px rgba(0,0,0,0.35)"
                  }}>
                  {eliminated.includes(hole) ? "❌" : won && hole === secret ? "🌰" : hole}
                </button>
                <span style={{ color: "white", fontSize: "0.7rem", background: "rgba(0,0,0,0.45)", padding: "2px 7px", borderRadius: "8px" }}>
                  #{hole}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Buttons */}
<div style={{ position: "fixed", bottom: "16px", left: 0, right: 0, textAlign: "center", zIndex: 10, display: "flex", justifyContent: "center", gap: "12px" }}>
  <button onClick={() => navigate("/")} style={{
    background: "rgba(255,255,255,0.9)", color: "#13294B", border: "none",
    padding: "12px 24px", borderRadius: "12px", fontSize: "1rem",
    fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
  }}>← Main Menu</button>
  <button onClick={restart} style={{
    background: "linear-gradient(135deg, #13294B, #1a3a6b)",
    color: "white", border: "none", padding: "12px 36px",
    borderRadius: "12px", fontSize: "1rem", fontWeight: "bold",
    cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.4)"
  }}>🔄 New Game</button>
</div>

      {/* Learn Popup */}
      {showLearn && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, animation: "fadeIn 0.3s ease-out" }}>
          <div style={{ background: "white", borderRadius: "24px", padding: "40px", maxWidth: "520px", width: "90%", textAlign: "left", boxShadow: "0 25px 60px rgba(0,0,0,0.5)", maxHeight: "85vh", overflowY: "auto" }}>
            <h2 style={{ color: "#FF5F05", textAlign: "center", marginTop: 0 }}>Binary Search?</h2>
            <p style={{ color: "#13294B", lineHeight: "1.8" }}>Binary Search is one of the smartest algorithms in computer science. Instead of checking every option one by one, it always cuts the remaining choices in half.</p>
            <div style={{ background: "#fff8f0", borderRadius: "12px", padding: "16px", margin: "16px 0", borderLeft: "4px solid #FF5F05" }}>
              <p style={{ margin: 0, color: "#333", lineHeight: "1.8" }}><strong>In this game:</strong> The acorn is hiding in one of 7 holes. The smartest move is always to guess the middle hole. Each guess eliminates half the remaining holes!</p>
            </div>
            <div style={{ background: "#e8f4fd", borderRadius: "12px", padding: "16px", margin: "16px 0" }}>
              <p style={{ margin: 0, color: "#13294B", lineHeight: "1.8" }}>💻 <strong>Big O Notation:</strong> Big O notation is a math tool used in computer science to describe an algorithm's speed or memory usage scales as the size of the input data increases.  Binary search runs in <strong>O(log n)</strong> time, meaning every step cuts the remaining options in half. Searching 1,000,000 items linearly takes up to 1,000,000 steps. Binary search does it in just 20!</p>
            </div>
            <button onClick={() => setShowLearn(false)} style={{ width: "100%", background: "#13294B", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer" }}>
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}