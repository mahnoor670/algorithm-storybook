import { useState } from "react";
import { useNavigate } from "react-router-dom";

function generateGroups() {
  const allNums = [12, 27, 34, 8, 45, 19, 31, 22];
  for (let i = allNums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allNums[i], allNums[j]] = [allNums[j], allNums[i]];
  }
  const half = Math.floor(allNums.length / 2);
  const left = [...allNums.slice(0, half)].sort((a, b) => a - b);
  const right = [...allNums.slice(half)].sort((a, b) => a - b);
  return { left, right };
}

const styles = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .student-btn:hover:not(:disabled) {
    transform: scale(1.08) translateY(-4px) !important;
  }
`;

export default function MergeSort() {
  const navigate = useNavigate();
  const initial = generateGroups();
  const [left, setLeft] = useState(initial.left);
  const [right, setRight] = useState(initial.right);
  const [merged, setMerged] = useState([]);
  const [steps, setSteps] = useState(0);
  const [message, setMessage] = useState("Two study groups need to merge! Click the student with fewer problems solved to go next.");
  const [won, setWon] = useState(false);
  const [hint, setHint] = useState(null);
  const [wasOptimal, setWasOptimal] = useState(null);
  const [showLearn, setShowLearn] = useState(false);

  const handlePick = async (side) => {
    if (won) return;
    if (side === 'left' && left.length === 0) return;
    if (side === 'right' && right.length === 0) return;

    const response = await fetch('https://algorithm-storybook.onrender.com/merge-sort/pick', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        left: left,
        right: right,
        merged: merged,
        picked_side: side,
        steps: steps
      })
    });

    const data = await response.json();

    setLeft(data.left);
    setRight(data.right);
    setMerged(data.merged);
    setSteps(data.steps);
    setWasOptimal(data.optimal);

    if (data.optimal) {
      setHint(`Correct! ${data.picked_value} had fewer problems solved, always merge the smaller value first!`);
      if (data.done) {
        setMessage(`Yay! The Study groups merged! Ready for the final exam in ${data.steps} steps!`);
        setWon(true);
        setHint(null);
      } else {
        setMessage(`Good! Keep merging! Remember to pick the next smallest student.`);
      }
    } else {
      setHint(`Not quite! ${data.correct_value} was smaller. In merge sort you always pick the smaller of the two front students!`);
      setMessage(`Try again! Pick the student with fewer problems solved.`);
    }
  };

  const restart = () => {
    const newGroups = generateGroups();
    setLeft(newGroups.left);
    setRight(newGroups.right);
    setMerged([]);
    setSteps(0);
    setWon(false);
    setHint(null);
    setWasOptimal(null);
    setMessage("Two study groups need to merge! Click the student with fewer problems solved to go next.");
  };

  const STUDENT_EMOJIS = ["🧑‍🎓", "👩‍🎓", "👨‍🎓", "🧑‍🎓", "👩‍🎓", "👨‍🎓", "🧑‍🎓", "👩‍🎓"];

  return (
    <>
      <style>{styles}</style>
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        fontFamily: "Georgia, serif", overflow: "hidden", position: "relative"
      }}>

        {/* Background */}
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundImage: "url('/classroom.jpg')",
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.45)", zIndex: 0
        }} />

        {/* Learn button */}
        <div style={{ position: "fixed", top: "16px", right: "16px", zIndex: 50 }}>
          <button onClick={() => setShowLearn(true)} style={{
            background: "#FF5F05", border: "none", color: "white",
            fontFamily: "Georgia, serif", fontSize: "0.85rem", fontWeight: "bold",
            padding: "10px 14px", borderRadius: "12px", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}>📖 Learn about this algorithm</button>
        </div>

        {/* Header */}
        <div style={{ textAlign: "center", padding: "24px 20px 8px", zIndex: 10, position: "relative" }}>
          <h1 style={{ color: "#FFD700", fontSize: "2.5rem", margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
            {won ? "🎉 Groups Merged!" : "Study Groups"}
          </h1>
          <p style={{ color: "#fff", fontSize: "0.95rem", margin: "4px 0 0", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
            A Merge Sort Adventure
          </p>
        </div>

        {/* Message box */}
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 20px", zIndex: 10, position: "relative" }}>
          <div style={{
            background: won ? "rgba(255,220,50,0.96)" : "rgba(255,255,255,0.93)",
            borderRadius: "16px", padding: "14px 24px",
            maxWidth: "680px", width: "100%", textAlign: "center",
            boxShadow: "0 6px 24px rgba(0,0,0,0.25)"
          }}>
            <p style={{ fontSize: "1.05rem", color: "#13294B", fontWeight: "bold", margin: 0, lineHeight: "1.6" }}>
              {message}
            </p>
          </div>
        </div>

        {/* Hint box */}
        {hint && !won && (
          <div style={{ display: "flex", justifyContent: "center", padding: "6px 20px", zIndex: 10, position: "relative" }}>
            <div style={{
              background: wasOptimal ? "rgba(50,180,80,0.92)" : "rgba(255,255,255,0.92)",
              borderRadius: "12px", padding: "10px 20px",
              maxWidth: "680px", width: "100%", textAlign: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
            }}>
              <p style={{ margin: 0, color: wasOptimal ? "white" : "#13294B", fontWeight: "bold", fontSize: "0.95rem" }}>
                {hint}
              </p>
            </div>
          </div>
        )}

        {/* Steps counter */}
        <div style={{ textAlign: "center", zIndex: 10, position: "relative", margin: "6px 0" }}>
          <span style={{ background: "rgba(19,41,75,0.85)", color: "white", padding: "5px 18px", borderRadius: "20px", fontSize: "0.9rem" }}>
            Steps: <strong>{steps}</strong>
          </span>
        </div>

        {/* Game area */}
        <div style={{
          position: "fixed", bottom: "100px", left: 0, right: 0,
          display: "flex", justifyContent: "center", gap: "40px",
          alignItems: "flex-end", zIndex: 10, padding: "0 20px"
        }}>

          {/* Left group */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "0.9rem", background: "rgba(19,41,75,0.7)", padding: "4px 12px", borderRadius: "20px" }}>
              Group A
            </span>
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
              {left.map((val, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "1.8rem" }}>{STUDENT_EMOJIS[i]}</span>
                  <div
                    className="student-btn"
                    onClick={() => i === 0 && handlePick('left')}
                    style={{
                      width: "65px", height: "70px",
                      background: i === 0
                        ? "linear-gradient(135deg, #FF5F05, #cc4400)"
                        : "linear-gradient(135deg, #555, #777)",
                      borderRadius: "10px",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      color: "white", fontWeight: "bold",
                      cursor: i === 0 ? "pointer" : "default",
                      opacity: i === 0 ? 1 : 0.5,
                      boxShadow: i === 0 ? "0 4px 14px rgba(255,95,5,0.5)" : "none",
                      transition: "all 0.2s",
                      border: i === 0 ? "2px solid rgba(255,255,255,0.4)" : "none"
                    }}
                  >
                    <span style={{ fontSize: "1.1rem" }}>{val}</span>
                    <span style={{ fontSize: "0.6rem", marginTop: "2px" }}>problems</span>
                  </div>
                </div>
              ))}
              {left.length === 0 && (
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", padding: "20px" }}>Empty!</div>
              )}
            </div>
          </div>

          {/* Merged group */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "0.9rem", background: "rgba(46,204,113,0.7)", padding: "4px 12px", borderRadius: "20px" }}>
              Merged
            </span>
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", minWidth: "80px", minHeight: "80px" }}>
              {merged.map((val, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "1.8rem" }}>🎉</span>
                  <div style={{
                    width: "55px", height: "70px",
                    background: "linear-gradient(135deg, #2ecc71, #27ae60)",
                    borderRadius: "10px",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: "bold",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                  }}>
                    <span style={{ fontSize: "1rem" }}>{val}</span>
                    <span style={{ fontSize: "0.55rem", marginTop: "2px" }}>problems</span>
                  </div>
                </div>
              ))}
              {merged.length === 0 && (
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", padding: "20px", border: "2px dashed rgba(255,255,255,0.2)", borderRadius: "10px" }}>
                  Merge here
                </div>
              )}
            </div>
          </div>

          {/* Right group */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "0.9rem", background: "rgba(19,41,75,0.7)", padding: "4px 12px", borderRadius: "20px" }}>
              Group B
            </span>
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
              {right.map((val, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontSize: "1.8rem" }}>{STUDENT_EMOJIS[i + 4]}</span>
                  <div
                    className="student-btn"
                    onClick={() => i === 0 && handlePick('right')}
                    style={{
                      width: "65px", height: "70px",
                      background: i === 0
                        ? "linear-gradient(135deg, #13294B, #1a3a6b)"
                        : "linear-gradient(135deg, #555, #777)",
                      borderRadius: "10px",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      color: "white", fontWeight: "bold",
                      cursor: i === 0 ? "pointer" : "default",
                      opacity: i === 0 ? 1 : 0.5,
                      boxShadow: i === 0 ? "0 4px 14px rgba(19,41,75,0.5)" : "none",
                      transition: "all 0.2s",
                      border: i === 0 ? "2px solid rgba(255,255,255,0.4)" : "none"
                    }}
                  >
                    <span style={{ fontSize: "1.1rem" }}>{val}</span>
                    <span style={{ fontSize: "0.6rem", marginTop: "2px" }}>problems</span>
                  </div>
                </div>
              ))}
              {right.length === 0 && (
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", padding: "20px" }}>Empty!</div>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{
          position: "fixed", bottom: "16px", left: 0, right: 0,
          textAlign: "center", zIndex: 10,
          display: "flex", justifyContent: "center", gap: "12px"
        }}>
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
      </div>

      {/* Learn Popup */}
      {showLearn && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "white", borderRadius: "24px", padding: "40px", maxWidth: "520px", width: "90%", textAlign: "left", boxShadow: "0 25px 60px rgba(0,0,0,0.5)", maxHeight: "85vh", overflowY: "auto" }}>
            <h2 style={{ color: "#FF5F05", textAlign: "center", marginTop: 0 }}>What is Merge Sort?</h2>
            <p style={{ color: "#13294B", lineHeight: "1.8" }}><strong>Merge Sort</strong> is a divide and conquer algorithm. It splits a list in half, sorts each half, then merges them back together.</p>
            <div style={{ background: "#fff8f0", borderRadius: "12px", padding: "16px", margin: "16px 0", borderLeft: "4px solid #FF5F05" }}>
              <p style={{ margin: 0, color: "#333", lineHeight: "1.8" }}>
                <strong>In this game:</strong> Two study groups have already sorted themselves by problems solved. Your job is to merge them into one sorted group by always picking the student with fewer problems solved first!
              </p>
            </div>
            <p style={{ color: "#13294B", fontWeight: "bold" }}>Example:</p>
            <ul style={{ color: "#555", lineHeight: "2.2" }}>
              <li>Group A: [8, 19, 27] | Group B: [12, 22, 34]</li>
              <li>Compare 8 and 12 → pick 8 → Merged: [8]</li>
              <li>Compare 19 and 12 → pick 12 → Merged: [8, 12]</li>
              <li>Compare 19 and 22 → pick 19 → Merged: [8, 12, 19]</li>
              <li>Keep going until all students are merged!</li>
            </ul>
            <div style={{ background: "#e8f4fd", borderRadius: "12px", padding: "16px", margin: "16px 0" }}>
              <p style={{ margin: 0, color: "#13294B", lineHeight: "1.8" }}>
                <strong>Big O Notation:</strong> Merge sort runs in <strong>O(n log n)</strong> in all cases — best, average, and worst. That makes it one of the most efficient sorting algorithms for large datasets!
              </p>
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