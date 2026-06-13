import { useState } from "react";
import { useNavigate } from "react-router-dom";

function generateScores() {
  const scores = [67, 82, 45, 91, 58, 73, 88];
  for (let i = scores.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [scores[i], scores[j]] = [scores[j], scores[i]];
  }
  return scores;
}

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .score-btn:hover:not(:disabled) {
    transform: scale(1.08) translateY(-4px) !important;
  }
`;

export default function QuickSort() {
  const navigate = useNavigate();

  const initState = (arr) => ({
    currentArr: arr,
    left: [],
    right: [],
    pivot: arr[arr.length - 1],
    placedIndices: [],
    sortedPositions: [],
    queue: [],
  });

  const initial = generateScores();
  const [state, setState] = useState(initState(initial));
  const [steps, setSteps] = useState(0);
  const [message, setMessage] = useState(`The TA picked ${initial[initial.length - 1]} as the pivot! Click each score and assign it left (lower) or right (higher).`);
  const [won, setWon] = useState(false);
  const [hint, setHint] = useState(null);
  const [showLearn, setShowLearn] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const STUDENT_EMOJIS = ["🧑‍💻", "👩‍💻", "👨‍💻", "🧑‍💻", "👩‍💻", "👨‍💻", "🧑‍💻"];

  const handleSelectScore = (index) => {
    if (won) return;
    if (index === state.currentArr.length - 1) return;
    if (state.placedIndices.includes(index)) return;
    setSelectedIndex(index);
    setHint(`Score ${state.currentArr[index]} selected! Is it less than or greater than pivot ${state.pivot}?`);
  };

  const handleAssign = async (side) => {
    if (selectedIndex === null || won) return;

    const response = await fetch('http://localhost:8080/quick-sort/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        current_arr: state.currentArr,
        selected_index: selectedIndex,
        side: side,
        left: state.left,
        right: state.right,
        pivot: state.pivot,
        placed_indices: state.placedIndices,
        queue: state.queue,
        sorted_positions: state.sortedPositions,
        steps: steps
      })
    });

    const data = await response.json();
    setSteps(data.steps);
    setSelectedIndex(null);

    if (data.correct) {
      setHint(`Correct! ${state.currentArr[selectedIndex]} goes ${side}!`);
    } else {
      setHint(`Not quite! ${state.currentArr[selectedIndex]} should go ${side === 'left' ? 'right' : 'left'} — it's ${side === 'left' ? 'greater' : 'less'} than pivot ${state.pivot}.`);
    }

    if (data.partition_complete) {
      if (data.done) {
        setState(prev => ({ ...prev, sortedPositions: data.sorted_positions }));
        setMessage(`🎉 All grades debugged and ranked in ${data.steps} steps!`);
        setWon(true);
        setHint(null);
      } else {
        setState({
          currentArr: data.next_arr,
          left: [],
          right: [],
          pivot: data.next_pivot,
          placedIndices: [],
          sortedPositions: data.sorted_positions,
          queue: data.queue,
        });
        setMessage(`Pivot ${state.pivot} locked in! New pivot: ${data.next_pivot}. Keep partitioning!`);
        setHint(null);
      }
    } else {
      setState(prev => ({
        ...prev,
        left: data.left,
        right: data.right,
        placedIndices: data.placed_indices,
      }));
    }
  };

  const restart = () => {
    const newScores = generateScores();
    setState(initState(newScores));
    setSteps(0);
    setWon(false);
    setHint(null);
    setSelectedIndex(null);
    setMessage(`The TA picked ${newScores[newScores.length - 1]} as the pivot! Click each score and assign it left (lower) or right (higher).`);
  };

  const unplacedCards = state.currentArr
    ? state.currentArr.filter((_, i) => !state.placedIndices.includes(i) && i !== state.currentArr.length - 1)
    : [];

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
          backgroundImage: "url('/coding.jpg')",
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
            {won ? "🎉 Grades Debugged!" : "Debug the Grades"}
          </h1>
          <p style={{ color: "#fff", fontSize: "0.95rem", margin: "4px 0 0", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
            A Quick Sort Adventure
          </p>
        </div>

        {/* Message box */}
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 20px", zIndex: 10, position: "relative" }}>
          <div style={{
            background: won ? "rgba(255,220,50,0.96)" : "rgba(255,255,255,0.93)",
            borderRadius: "16px", padding: "14px 24px",
            maxWidth: "720px", width: "100%", textAlign: "center",
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
              background: "rgba(50,180,80,0.92)",
              borderRadius: "12px", padding: "10px 20px",
              maxWidth: "720px", width: "100%", textAlign: "center",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)"
            }}>
              <p style={{ margin: 0, color: "white", fontWeight: "bold", fontSize: "0.95rem" }}>
                {hint}
              </p>
            </div>
          </div>
        )}

        {/* Steps */}
        <div style={{ textAlign: "center", zIndex: 10, position: "relative", margin: "4px 0" }}>
          <span style={{ background: "rgba(19,41,75,0.85)", color: "white", padding: "5px 18px", borderRadius: "20px", fontSize: "0.9rem" }}>
            Steps: <strong>{steps}</strong>
          </span>
        </div>

        {/* Locked in */}
        {state.sortedPositions && state.sortedPositions.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", padding: "4px 20px", zIndex: 10, position: "relative" }}>
            <div style={{
              background: "rgba(19,41,75,0.85)",
              borderRadius: "12px", padding: "8px 16px",
              maxWidth: "720px", width: "100%", textAlign: "center",
            }}>
              <p style={{ margin: "0 0 6px", color: "white", fontSize: "0.75rem", fontWeight: "bold" }}>
                Locked in ✅
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap" }}>
                {[...state.sortedPositions].sort((a, b) => a - b).map((val, i) => (
                  <div key={i} style={{
                    width: "44px", height: "44px",
                    background: "linear-gradient(135deg, #2ecc71, #27ae60)",
                    borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: "bold", fontSize: "0.85rem",
                    boxShadow: "0 2px 8px rgba(46,204,113,0.4)"
                  }}>
                    {val}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Left Right buttons */}
        {selectedIndex !== null && !won && (
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", zIndex: 10, position: "relative", margin: "6px 0" }}>
            <button onClick={() => handleAssign('left')} style={{
              background: "linear-gradient(135deg, #3498db, #2980b9)",
              color: "white", border: "none", padding: "10px 28px",
              borderRadius: "10px", fontSize: "0.95rem", fontWeight: "bold",
              cursor: "pointer", boxShadow: "0 4px 12px rgba(52,152,219,0.4)"
            }}>← Left (Lower)</button>
            <button onClick={() => handleAssign('right')} style={{
              background: "linear-gradient(135deg, #e74c3c, #c0392b)",
              color: "white", border: "none", padding: "10px 28px",
              borderRadius: "10px", fontSize: "0.95rem", fontWeight: "bold",
              cursor: "pointer", boxShadow: "0 4px 12px rgba(231,76,60,0.4)"
            }}>Right (Higher) →</button>
          </div>
        )}

        {/* Three column game area */}
        {!won && (
          <div style={{
            position: "fixed", bottom: "100px", left: 0, right: 0,
            display: "flex", justifyContent: "center", gap: "16px",
            alignItems: "flex-end", zIndex: 10, padding: "0 20px"
          }}>

            {/* Left pile */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", minWidth: "130px" }}>
              <span style={{ color: "white", fontWeight: "bold", fontSize: "0.85rem", background: "rgba(52,152,219,0.85)", padding: "4px 14px", borderRadius: "20px" }}>
                ← Lower
              </span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", minHeight: "75px", alignItems: "flex-end" }}>
                {state.left && state.left.map((val, i) => (
                  <div key={i} style={{
                    width: "55px", height: "65px",
                    background: "linear-gradient(135deg, #3498db, #2980b9)",
                    borderRadius: "10px",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: "bold",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                    animation: "fadeIn 0.3s ease-out"
                  }}>
                    <span>{val}</span>
                    <span style={{ fontSize: "0.55rem" }}>pts</span>
                  </div>
                ))}
                {(!state.left || state.left.length === 0) && (
                  <div style={{ width: "55px", height: "65px", border: "2px dashed rgba(52,152,219,0.4)", borderRadius: "10px" }} />
                )}
              </div>
            </div>

            {/* Center - unplaced + pivot */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "white", fontWeight: "bold", fontSize: "0.85rem", background: "rgba(19,41,75,0.8)", padding: "4px 14px", borderRadius: "20px" }}>
                To assign
              </span>
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                {state.currentArr && state.currentArr.map((score, index) => {
                  const isPivot = index === state.currentArr.length - 1;
                  const isPlaced = state.placedIndices && state.placedIndices.includes(index);
                  const isSelected = selectedIndex === index;
                  if (isPlaced && !isPivot) return null;
                  return (
                    <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontSize: "1.4rem" }}>{STUDENT_EMOJIS[index % 7]}</span>
                      <div
                        className={isPivot ? "" : "score-btn"}
                        onClick={() => !isPivot && !isPlaced && handleSelectScore(index)}
                        style={{
                          width: "62px", height: "72px",
                          background: isPivot
                            ? "linear-gradient(135deg, #FFD700, #FFA500)"
                            : isSelected
                            ? "linear-gradient(135deg, #2ecc71, #27ae60)"
                            : "linear-gradient(135deg, #FF5F05, #cc4400)",
                          borderRadius: "10px",
                          display: "flex", flexDirection: "column",
                          alignItems: "center", justifyContent: "center",
                          color: isPivot ? "#13294B" : "white",
                          fontWeight: "bold",
                          cursor: isPivot ? "default" : "pointer",
                          boxShadow: isPivot
                            ? "0 4px 14px rgba(255,215,0,0.6)"
                            : isSelected
                            ? "0 4px 14px rgba(46,204,113,0.6)"
                            : "0 4px 10px rgba(0,0,0,0.3)",
                          border: isPivot ? "3px solid white" : isSelected ? "3px solid #2ecc71" : "none",
                          transition: "all 0.2s"
                        }}
                      >
                        <span style={{ fontSize: "1.1rem" }}>{score}</span>
                        <span style={{ fontSize: "0.55rem", marginTop: "2px" }}>
                          {isPivot ? "PIVOT" : "pts"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right pile */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", minWidth: "130px" }}>
              <span style={{ color: "white", fontWeight: "bold", fontSize: "0.85rem", background: "rgba(231,76,60,0.85)", padding: "4px 14px", borderRadius: "20px" }}>
                Higher →
              </span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", minHeight: "75px", alignItems: "flex-end" }}>
                {state.right && state.right.map((val, i) => (
                  <div key={i} style={{
                    width: "55px", height: "65px",
                    background: "linear-gradient(135deg, #e74c3c, #c0392b)",
                    borderRadius: "10px",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: "bold",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                    animation: "fadeIn 0.3s ease-out"
                  }}>
                    <span>{val}</span>
                    <span style={{ fontSize: "0.55rem" }}>pts</span>
                  </div>
                ))}
                {(!state.right || state.right.length === 0) && (
                  <div style={{ width: "55px", height: "65px", border: "2px dashed rgba(231,76,60,0.4)", borderRadius: "10px" }} />
                )}
              </div>
            </div>

          </div>
        )}

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
            <h2 style={{ color: "#FF5F05", textAlign: "center", marginTop: 0 }}>What is Quick Sort?</h2>
            <p style={{ color: "#13294B", lineHeight: "1.8" }}><strong>Quick Sort</strong> picks the last element as a pivot, puts everything smaller to the left and everything larger to the right, then repeats for each side.</p>
            <div style={{ background: "#fff8f0", borderRadius: "12px", padding: "16px", margin: "16px 0", borderLeft: "4px solid #FF5F05" }}>
              <p style={{ margin: 0, color: "#333", lineHeight: "1.8" }}>
                <strong>In this game:</strong> The last score is always the pivot. Click each other score and assign it left (lower than pivot) or right (higher than pivot). Once all scores are assigned the pivot locks in place and the process repeats for each side!
              </p>
            </div>
            <p style={{ color: "#13294B", fontWeight: "bold" }}>Example:</p>
            <ul style={{ color: "#555", lineHeight: "2.2" }}>
              <li>Scores: [67, 82, 45, 91, 58] — pivot is 58</li>
              <li>67 {">"} 58 → right</li>
              <li>82 {">"} 58 → right</li>
              <li>45 {"<"} 58 → left</li>
              <li>91 {">"} 58 → right</li>
              <li>Result: [45] | [58] | [67, 82, 91] — 58 locked!</li>
            </ul>
            <div style={{ background: "#e8f4fd", borderRadius: "12px", padding: "16px", margin: "16px 0" }}>
              <p style={{ margin: 0, color: "#13294B", lineHeight: "1.8" }}>
                <strong>Big O Notation:</strong> Quick sort runs in <strong>O(n log n)</strong> on average but <strong>O(n²)</strong> worst case when the pivot is always the smallest or largest. Good pivot choice matters!
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