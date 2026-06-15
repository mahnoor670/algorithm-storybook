import { useState } from "react";
import { useNavigate } from "react-router-dom";

function generateBooks() {
  const years = [1987, 2003, 1995, 2021, 1972, 2015, 2008];
  for (let i = years.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [years[i], years[j]] = [years[j], years[i]];
  }
  return years;
}

const API = "https://algorithm-storybook.onrender.com";

const styles = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .slot-btn:hover:not(:disabled) {
    transform: scale(1.08) translateY(-4px) !important;
    border-color: #FFD700 !important;
  }
`;

export default function InsertionSort() {
  const navigate = useNavigate();
  const [books, setBooks] = useState(generateBooks());
  const [sortedCount, setSortedCount] = useState(1);
  const [steps, setSteps] = useState(0);
  const [message, setMessage] = useState("Insert the highlighted book into the correct position on the shelf!");
  const [won, setWon] = useState(false);
  const [hint, setHint] = useState(null);
  const [wasOptimal, setWasOptimal] = useState(null);
  const [showLearn, setShowLearn] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [scoreSaved, setScoreSaved] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  const currentBook = books[sortedCount];

  const fetchLeaderboard = async () => {
    const res = await fetch(`${API}/leaderboard?game=insertion-sort`);
    const data = await res.json();
    setLeaderboard(data);
  };

  const saveScore = async () => {
    if (!playerName.trim()) return;
    await fetch(`${API}/leaderboard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: playerName.trim(), game: "insertion-sort", steps })
    });
    setScoreSaved(true);
    fetchLeaderboard();
  };

  const handleInsert = async (insertPosition) => {
    if (won || sortedCount >= books.length) return;

    const response = await fetch(`${API}/insertion-sort/insert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ arr: [...books], sorted_count: sortedCount, insert_position: insertPosition, steps: steps })
    });

    const data = await response.json();
    setBooks(data.arr);
    setSteps(data.steps);
    setWasOptimal(data.optimal);

    if (data.optimal) {
      setSortedCount(data.sorted_count);
      setHint(`Correct! ${currentBook} belongs at position ${insertPosition + 1}. Insertion sort slides each book into its right spot!`);
      if (data.done) {
        setMessage(`📚 Library Lineup complete! All books sorted in ${data.steps} steps!`);
        setWon(true);
        setHint(null);
        setShowLeaderboard(true);
        fetchLeaderboard();
      } else {
        setMessage(`Good! Now insert the next highlighted book into the correct position.`);
      }
    } else {
      setHint(`Not quite! ${currentBook} belongs at position ${data.correct_position + 1}. Look at the sorted books and find where it fits!`);
      setMessage(`Try again! Find the right spot for ${currentBook}.`);
    }
  };

  const restart = () => {
    setBooks(generateBooks());
    setSortedCount(1);
    setSteps(0);
    setWon(false);
    setHint(null);
    setWasOptimal(null);
    setShowLeaderboard(false);
    setPlayerName("");
    setScoreSaved(false);
    setMessage("Insert the highlighted book into the correct position on the shelf!");
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Ubuntu', sans-serif", overflow: "hidden", position: "relative" }}>

        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: "url('/library.jpg')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.45)", zIndex: 0 }} />

        <div style={{ position: "fixed", top: "16px", right: "16px", zIndex: 50 }}>
          <button onClick={() => setShowLearn(true)} style={{ background: "#FF5F05", border: "none", color: "white", fontFamily: "'Ubuntu', sans-serif", fontSize: "0.85rem", fontWeight: "bold", padding: "10px 14px", borderRadius: "12px", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>📖 Learn about this algorithm</button>
        </div>

        <div style={{ textAlign: "center", padding: "24px 20px 8px", zIndex: 10, position: "relative" }}>
          <h1 style={{ color: "#FFD700", fontSize: "2.5rem", margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{won ? "📚 Library Lined Up!" : "Library Lineup"}</h1>
          <p style={{ color: "#fff", fontSize: "0.95rem", margin: "4px 0 0", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>An Insertion Sort Adventure</p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", padding: "8px 20px", zIndex: 10, position: "relative" }}>
          <div style={{ background: won ? "rgba(255,220,50,0.96)" : "rgba(255,255,255,0.93)", borderRadius: "16px", padding: "14px 24px", maxWidth: "680px", width: "100%", textAlign: "center", boxShadow: "0 6px 24px rgba(0,0,0,0.25)" }}>
            <p style={{ fontSize: "1.05rem", color: "#13294B", fontWeight: "bold", margin: 0, lineHeight: "1.6" }}>{message}</p>
          </div>
        </div>

        {hint && !won && (
          <div style={{ display: "flex", justifyContent: "center", padding: "6px 20px", zIndex: 10, position: "relative" }}>
            <div style={{ background: wasOptimal ? "rgba(50,180,80,0.92)" : "rgba(255,255,255,0.92)", borderRadius: "12px", padding: "10px 20px", maxWidth: "680px", width: "100%", textAlign: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
              <p style={{ margin: 0, color: wasOptimal ? "white" : "#13294B", fontWeight: "bold", fontSize: "0.95rem" }}>{hint}</p>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", zIndex: 10, position: "relative", margin: "6px 0" }}>
          <span style={{ background: "rgba(19,41,75,0.85)", color: "white", padding: "5px 18px", borderRadius: "20px", fontSize: "0.9rem" }}>Steps: <strong>{steps}</strong></span>
        </div>

        {!won && currentBook && (
          <div style={{ textAlign: "center", zIndex: 10, position: "relative", margin: "8px 0" }}>
            <div style={{ display: "inline-block", background: "rgba(255,215,0,0.95)", borderRadius: "12px", padding: "10px 24px", boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}>
              <p style={{ margin: 0, color: "#13294B", fontWeight: "bold" }}>📖 Current book to insert: <strong>{currentBook}</strong></p>
            </div>
          </div>
        )}

        <div style={{ position: "fixed", bottom: "100px", left: 0, right: 0, display: "flex", justifyContent: "center", gap: "8px", alignItems: "flex-end", zIndex: 10, padding: "0 40px" }}>
          {books.slice(0, sortedCount).map((year, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <button className="slot-btn" onClick={() => handleInsert(index)} disabled={won} style={{ width: "20px", height: "60px", background: "rgba(255,215,0,0.3)", border: "2px dashed rgba(255,215,0,0.6)", borderRadius: "6px", cursor: won ? "default" : "pointer", transition: "all 0.2s" }} />
              <div style={{ width: "60px", height: "80px", background: "linear-gradient(135deg, #8B4513, #A0522D)", borderRadius: "4px 8px 8px 4px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", boxShadow: "0 4px 10px rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <span style={{ fontSize: "1.4rem" }}>📚</span>
                <span style={{ fontSize: "0.65rem", marginTop: "4px" }}>{year}</span>
              </div>
              <span style={{ color: "white", fontSize: "0.65rem", background: "rgba(46,204,113,0.6)", padding: "2px 6px", borderRadius: "8px" }}>sorted</span>
            </div>
          ))}

          {!won && (
            <button className="slot-btn" onClick={() => handleInsert(sortedCount)} disabled={won} style={{ width: "20px", height: "60px", background: "rgba(255,215,0,0.3)", border: "2px dashed rgba(255,215,0,0.6)", borderRadius: "6px", cursor: won ? "default" : "pointer", transition: "all 0.2s", alignSelf: "flex-end", marginBottom: "86px" }} />
          )}

          {books.slice(sortedCount + 1).map((year, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "20px", height: "60px" }} />
              <div style={{ width: "60px", height: "80px", background: "linear-gradient(135deg, #555, #777)", borderRadius: "4px 8px 8px 4px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", boxShadow: "0 4px 10px rgba(0,0,0,0.4)", opacity: 0.6 }}>
                <span style={{ fontSize: "1.4rem" }}>📖</span>
                <span style={{ fontSize: "0.65rem", marginTop: "4px" }}>{year}</span>
              </div>
              <span style={{ color: "white", fontSize: "0.65rem", background: "rgba(0,0,0,0.45)", padding: "2px 6px", borderRadius: "8px" }}>unsorted</span>
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
            <h2 style={{ color: "#FF5F05", marginTop: 0 }}>📚 Library Lined Up!</h2>
            <p style={{ color: "#13294B", fontWeight: "bold", fontSize: "1.1rem" }}>You did it in <strong>{steps}</strong> step{steps !== 1 ? "s" : ""}!</p>
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
                    <span>{entry.steps} step{entry.steps !== 1 ? "s" : ""}</span>
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
            <h2 style={{ color: "#FF5F05", textAlign: "center", marginTop: 0 }}>Insertion Sort</h2>
            <p style={{ color: "#13294B", lineHeight: "1.8" }}><strong>Insertion Sort</strong> works by taking one item at a time and inserting it into the correct position among the already sorted items.</p>
            <div style={{ background: "#fff8f0", borderRadius: "12px", padding: "16px", margin: "16px 0", borderLeft: "4px solid #FF5F05" }}>
              <p style={{ margin: 0, color: "#333", lineHeight: "1.8" }}><strong>In this game:</strong> Books arrive one at a time. You need to slide each book into the right spot on the shelf so they stay in order by year!</p>
            </div>
            <div style={{ background: "#e8f4fd", borderRadius: "12px", padding: "16px", margin: "16px 0" }}>
              <p style={{ margin: 0, color: "#13294B", lineHeight: "1.8" }}>💻<strong> Big O Notation:</strong> Insertion sort runs in <strong>O(n²)</strong> in the worst case but <strong>O(n)</strong> when the list is nearly sorted, making it great for small or almost-sorted datasets!</p>
            </div>
            <button onClick={() => setShowLearn(false)} style={{ width: "100%", background: "#13294B", color: "white", border: "none", padding: "14px", borderRadius: "12px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer" }}>Got it!</button>
          </div>
        </div>
      )}
    </>
  );
}