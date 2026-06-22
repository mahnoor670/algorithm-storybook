import { useState } from "react";
import { useNavigate } from "react-router-dom";

function generateShuffled() {
  const arr = [1, 2, 3, 4, 5, 6];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const STUDENT_EMOJIS = ["🧑‍🎓", "👩‍🎓", "👨‍🎓", "🧑‍🎓", "👩‍🎓", "👨‍🎓"];
const API = "https://algorithm-storybook.onrender.com";

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes flash {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  .student-btn:hover:not(:disabled) {
    transform: scale(1.1) translateY(-4px) !important;
  }
`;

export default function BubbleSort() {
  const navigate = useNavigate();
  const [students, setStudents] = useState(generateShuffled());
  const [selected, setSelected] = useState(null);
  const [swaps, setSwaps] = useState(0);
  const [message, setMessage] = useState("Click the LARGER student first, then their smaller neighbor to swap! Sort shortest to tallest for the class photo!");
  const [won, setWon] = useState(false);
  const [lastSwap, setLastSwap] = useState(null);
  const [hint, setHint] = useState(null);
  const [wasOptimal, setWasOptimal] = useState(null);
  const [showLearn, setShowLearn] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [scoreSaved, setScoreSaved] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const fetchLeaderboard = async () => {
    const res = await fetch(`${API}/leaderboard?game=bubble-sort`);
    const data = await res.json();
    setLeaderboard(data);
  };

  const saveScore = async () => {
    if (!playerName.trim()) return;
    await fetch(`${API}/leaderboard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: playerName.trim(), game: "bubble-sort", steps: swaps, join_code: localStorage.getItem("joinCode") || null })
    });
    setScoreSaved(true);
    fetchLeaderboard();
  };

  const handleClick = async (index) => {
    if (won) return;

    if (selected === null) {
      setSelected(index);
      setMessage(`Student at position ${index + 1} selected! Now click a neighbor to swap.`);
      return;
    }

    if (Math.abs(selected - index) !== 1) {
      setSelected(index);
      setMessage(`Those students aren't next to each other! Pick a neighbor to swap.`);
      return;
    }

    const response = await fetch(`${API}/bubble-sort/swap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ arr: [...students], index1: selected, index2: index, swaps: swaps })
    });

    const data = await response.json();
    setStudents(data.arr);
    setSwaps(data.swaps);
    setSelected(null);
    setLastSwap(data.optimal ? [selected, index] : null);
    setWasOptimal(data.optimal);

    if (data.optimal) {
      setHint(`Good swap! Bubble sort always fixes neighbors that are out of order!`);
    } else {
      setHint(`That swap wasn't needed as those two were already in order!`);
    }

    if (data.sorted) {
      setMessage(`📸 Great! The class photo is ready! You sorted everyone in ${data.swaps} swaps!`);
      setWon(true);
      setHint(null);
      setShowLeaderboard(true);
      fetchLeaderboard();
    } else {
      setMessage(`Keep going! Find neighbors that are out of order and swap them.`);
    }
  };

  const restart = () => {
    setStudents(generateShuffled());
    setSelected(null);
    setSwaps(0);
    setWon(false);
    setLastSwap(null);
    setHint(null);
    setWasOptimal(null);
    setShowLeaderboard(false);
    setPlayerName("");
    setScoreSaved(false);
    setMessage("Click the LARGER student first, then their smaller neighbor to swap! Sort shortest to tallest for the class photo!");
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Ubuntu', sans-serif", overflow: "hidden", position: "relative", background: "transparent" }}>

        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: "url('/photography.jpg')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.5)", zIndex: 0 }} />

        <div style={{ position: "fixed", top: "16px", right: "16px", zIndex: 50 }}>
          <button onClick={() => setShowLearn(true)} style={{ background: "#FF5F05", border: "none", color: "white", fontFamily: "'Ubuntu', sans-serif", fontSize: "0.85rem", fontWeight: "bold", padding: "10px 14px", borderRadius: "12px", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>📚 Learn about this algorithm</button>
        </div>

        <div style={{ textAlign: "center", padding: "24px 20px 8px", zIndex: 10, position: "relative" }}>
          <h1 style={{ color: "#FF5F05", fontSize: "2.5rem", margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{won ? "📸 Class Photo!" : "Class Photo"}</h1>
          <p style={{ color: "#fff", fontSize: "0.95rem", margin: "4px 0 0", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>A Bubble Sort Adventure</p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", padding: "8px 20px", zIndex: 10, position: "relative" }}>
          <div style={{ background: won ? "rgba(255,220,50,0.96)" : "rgba(255,255,255,0.93)", borderRadius: "16px", padding: "14px 24px", maxWidth: "620px", width: "100%", textAlign: "center", boxShadow: "0 6px 24px rgba(0,0,0,0.25)", transition: "background 0.4s" }}>
            <p style={{ fontSize: "1.05rem", color: "#13294B", fontWeight: "bold", margin: 0, lineHeight: "1.6" }}>{message}</p>
          </div>
        </div>

        {hint && !won && (
          <div style={{ display: "flex", justifyContent: "center", padding: "6px 20px", zIndex: 10, position: "relative" }}>
            <div style={{ background: wasOptimal ? "rgba(50,180,80,0.92)" : "rgba(255,255,255,0.92)", borderRadius: "12px", padding: "10px 20px", maxWidth: "620px", width: "100%", textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
              <p style={{ margin: 0, color: wasOptimal ? "white" : "#13294B", fontWeight: "bold", fontSize: "0.95rem" }}>{hint}</p>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", zIndex: 10, position: "relative", margin: "6px 0" }}>
          <span style={{ background: "rgba(19,41,75,0.85)", color: "white", padding: "5px 18px", borderRadius: "20px", fontSize: "0.9rem" }}>Swaps: <strong>{swaps}</strong></span>
        </div>

        <div style={{ position: "fixed", bottom: "100px", left: 0, right: 0, display: "flex", justifyContent: "center", gap: "16px", alignItems: "flex-end", zIndex: 10, padding: "0 40px" }}>
          {students.map((height, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <div style={{ fontSize: "2rem", animation: selected === index ? "bounce 0.5s ease-in-out infinite" : "none", filter: selected === index ? "drop-shadow(0 0 8px #FF5F05)" : "none", transition: "all 0.3s" }}>{won ? "🎉" : STUDENT_EMOJIS[index]}</div>
              <div style={{ width: "60px", height: `${height * 30}px`, background: selected === index ? "linear-gradient(135deg, #FF5F05, #ff8c00)" : lastSwap && lastSwap.includes(index) ? "linear-gradient(135deg, #2ecc71, #27ae60)" : "linear-gradient(135deg, #13294B, #1a3a6b)", borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "1.1rem", boxShadow: selected === index ? "0 0 20px rgba(255,95,5,0.6)" : "0 4px 10px rgba(0,0,0,0.3)", transition: "all 0.3s", cursor: won ? "default" : "pointer" }} className="student-btn" onClick={() => handleClick(index)}>{height}</div>
              <span style={{ color: "white", fontSize: "0.7rem", background: "rgba(0,0,0,0.45)", padding: "2px 7px", borderRadius: "8px" }}>#{index + 1}</span>
            </div>
          ))}
        </div>

        <div style={{ position: "fixed", bottom: "16px", left: 0, right: 0, textAlign: "center", zIndex: 10, display: "flex", justifyContent: "center", gap: "12px" }}>
          <button onClick={() => navigate("/")} style={{ background: "rgba(255,255,255,0.9)", color: "#13294B", border: "none", padding: "12px 24px", borderRadius: "12px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }}>← Main Menu</button>
          <button onClick={restart} style={{ background: "linear-gradient(135deg, #13294B, #1a3a6b)", color: "white", border: "none", padding: "12px 36px", borderRadius: "12px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.4)" }}>🔄 New Game</button>
        </div>
      </div>

      {showLeaderboard && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, animation: "fadeIn 0.3s ease-out" }}>
          <div style={{ background: "white", borderRadius: "24px", padding: "36px", maxWidth: "460px", width: "90%", textAlign: "center", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
            <h2 style={{ color: "#FF5F05", marginTop: 0 }}>📸 Class Photo Done!</h2>
            <p style={{ color: "#13294B", fontWeight: "bold", fontSize: "1.1rem" }}>You sorted everyone in <strong>{swaps}</strong> swap{swaps !== 1 ? "s" : ""}!</p>
            {!scoreSaved ? (
              <>
                <p style={{ color: "#666", fontSize: "0.95rem" }}>Enter your name to save your score to the leaderboard.</p>
                <input type="text" placeholder="Your name" value={playerName} onChange={e => setPlayerName(e.target.value)} maxLength={20} style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "2px solid #ddd", fontSize: "1rem", marginBottom: "12px", boxSizing: "border-box", fontFamily: "'Ubuntu', sans-serif" }} />
                <button onClick={saveScore} disabled={!playerName.trim()} style={{ width: "100%", background: "#FF5F05", color: "white", border: "none", padding: "12px", borderRadius: "10px", fontSize: "1rem", fontWeight: "bold", cursor: playerName.trim() ? "pointer" : "not-allowed", opacity: playerName.trim() ? 1 : 0.5, marginBottom: "10px" }}>Save Score</button>
                <button onClick={() => setShowLeaderboard(false)} style={{ width: "100%", background: "#13294B", color: "white", border: "none", padding: "12px", borderRadius: "10px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer" }}>Skip</button>
              </>
            ) : (
              <>
                <p style={{ color: "#2d8a1e", fontWeight: "bold" }}>Score saved!</p>
                <h3 style={{ color: "#13294B", marginBottom: "12px" }}>Top Scores</h3>
                {leaderboard.map((entry, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderRadius: "8px", background: i === 0 ? "#fff8e1" : "#f9f9f9", marginBottom: "6px", fontWeight: i === 0 ? "bold" : "normal" }}>
                    <span>{i + 1}. {entry.name}</span>
                    <span>{entry.steps} swap{entry.steps !== 1 ? "s" : ""}</span>
                  </div>
                ))}
                <button onClick={() => setShowLeaderboard(false)} style={{ width: "100%", background: "#13294B", color: "white", border: "none", padding: "12px", borderRadius: "10px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", marginTop: "12px" }}>Close</button>
              </>
            )}
          </div>
        </div>
      )}

      {showLearn && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: "24px", padding: "40px", maxWidth: "520px", width: "90%", textAlign: "left", boxShadow: "0 25px 60px rgba(0,0,0,0.5)", maxHeight: "85vh", overflowY: "auto" }}>
            <h2 style={{ color: "#FF5F05", textAlign: "center", marginTop: 0 }}>Bubble Sort</h2>
            <p style={{ color: "#13294B", lineHeight: "1.8" }}><strong>Bubble Sort</strong> is one of the simplest sorting algorithms. It works by repeatedly comparing two neighboring items and swapping them if they are in the wrong order. Bubble sort is named after the way larger or smaller numbers slowly rise to their correct spot, like bubbles fizzing up in a soda.</p>
            <div style={{ background: "#fff8f0", borderRadius: "12px", padding: "16px", margin: "16px 0", borderLeft: "4px solid #FF5F05" }}>
              <p style={{ margin: 0, color: "#333", lineHeight: "1.8" }}><strong>In this game:</strong> Each student has a height number. Compare two neighbors, swap them if they're out of order, and keep repeating until everyone is lined up shortest to tallest!</p>
            </div>
            <div style={{ background: "#e8f4fd", borderRadius: "12px", padding: "16px", margin: "16px 0" }}>
              <p style={{ margin: 0, color: "#13294B", lineHeight: "1.8" }}>💻<strong> Big O Notation:</strong> Bubble sort runs in <strong>O(n²)</strong> time in the worst and average case. In the best case, when the list is already sorted, it runs in <strong>O(n)</strong> time since it only needs one pass to confirm everything is in order.</p>
            </div>
            <button onClick={() => setShowLearn(false)} style={{ width: "100%", background: "#13294B", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer" }}>Got it!</button>
          </div>
        </div>
      )}
    </>
  );
}