import { useState } from "react";
import { useNavigate } from "react-router-dom";

function generateGrades() {
  const grades = [45, 62, 78, 91, 55, 83, 70];
  for (let i = grades.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [grades[i], grades[j]] = [grades[j], grades[i]];
  }
  return grades;
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
  .exam-btn:hover:not(:disabled) {
    transform: scale(1.08) translateY(-4px) !important;
  }
`;

export default function SelectionSort() {
  const navigate = useNavigate();
  const [grades, setGrades] = useState(generateGrades());
  const [sortedCount, setSortedCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [steps, setSteps] = useState(0);
  const [message, setMessage] = useState("Help the professor sort the exams! Each round, find the lowest grade in the unsorted pile and click it!");
  const [won, setWon] = useState(false);
  const [hint, setHint] = useState(null);
  const [wasOptimal, setWasOptimal] = useState(null);
  const [showLearn, setShowLearn] = useState(false);

  const handleClick = (index) => {
    if (won || index < sortedCount) return;

    const unsorted = grades.slice(sortedCount);
    const minVal = Math.min(...unsorted);
    const minIndex = grades.indexOf(minVal, sortedCount);
    const isOptimal = (grades[index] === minVal);

    const newGrades = [...grades];
    [newGrades[sortedCount], newGrades[index]] = [newGrades[index], newGrades[sortedCount]];

    const newSortedCount = sortedCount + 1;
    const newSteps = steps + 1;
setSteps(newSteps);
setWasOptimal(isOptimal);
setSelectedIndex(null);

if (isOptimal) {
  const newGrades = [...grades];
  [newGrades[sortedCount], newGrades[index]] = [newGrades[index], newGrades[sortedCount]];
  const newSortedCount = sortedCount + 1;
  setGrades(newGrades);
  setSortedCount(newSortedCount);
  setHint(`Correct! Grade ${grades[index]} was the lowest in the unsorted pile. Selection sort always picks the minimum and places it next!`);
  if (newSortedCount === newGrades.length) {
    setMessage(`📚 All done! The professor's exams are sorted in ${newSteps} steps!`);
    setWon(true);
    setHint(null);
  } else {
    setMessage(`Good! Now find the lowest grade in the remaining unsorted exams.`);
  }
} else {
  setHint(`Not quite! Grade ${minVal} was the lowest in the unsorted pile. Selection sort scans the entire unsorted section to find the minimum each round.`);
  setWasOptimal(false);
  setMessage(`Try again! Find the lowest grade in the unsorted exams.`);
}

    if (newSortedCount === newGrades.length) {
      setMessage(`📚 All done! The professor's exams are sorted in ${newSteps} steps!`);
      setWon(true);
      setHint(null);
    } else {
      setMessage(`Good! Now find the lowest grade in the remaining unsorted exams.`);
    }
  };

  const restart = () => {
    setGrades(generateGrades());
    setSortedCount(0);
    setSelectedIndex(null);
    setSteps(0);
    setWon(false);
    setHint(null);
    setWasOptimal(null);
    setMessage("Help the professor sort the exams! Each round, find the lowest grade in the unsorted pile and click it!");
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        fontFamily: "Georgia, serif", overflow: "hidden", position: "relative",
        background: "transparent"
      }}>

        {/* Background */}
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "linear-gradient(160deg, #2c3e50 0%, #3498db 100%)",
          zIndex: 0
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
          <h1 style={{ color: "#FF5F05", fontSize: "2.5rem", margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
            {won ? "📚 Exams Sorted!" : "Professor's Stack"}
          </h1>
          <p style={{ color: "#fff", fontSize: "0.95rem", margin: "4px 0 0", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
            A Selection Sort Adventure
          </p>
        </div>

        {/* Message box */}
<div style={{ display: "flex", justifyContent: "center", padding: "8px 20px", zIndex: 10, position: "relative" }}>
  <div style={{
    background: won ? "rgba(255,220,50,0.96)" : "rgba(255,255,255,0.93)",
    borderRadius: "16px", padding: "14px 24px",
    maxWidth: "680px", width: "100%", textAlign: "center",
    boxShadow: "0 6px 24px rgba(0,0,0,0.25)", transition: "background 0.4s"
  }}>
    <p style={{ fontSize: "1.05rem", color: "#13294B", fontWeight: "bold", margin: 0, lineHeight: "1.6" }}>
      {won ? message : "Help the professor sort the exams! Each round, find the lowest grade in the unsorted pile and click it!"}
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

        {/* Exams */}
        <div style={{
          position: "fixed", bottom: "100px", left: 0, right: 0,
          display: "flex", justifyContent: "center", gap: "14px",
          alignItems: "flex-end", zIndex: 10, padding: "0 40px"
        }}>
          {grades.map((grade, index) => {
            const isSorted = index < sortedCount;
            return (
              <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={{ fontSize: "1.8rem" }}>
                  {isSorted ? "✅" : won ? "🎉" : "📄"}
                </div>
                <div
                  className="exam-btn"
                  onClick={() => handleClick(index)}
                  style={{
                    width: "70px", height: "90px",
                    background: isSorted
                      ? "linear-gradient(135deg, #2ecc71, #27ae60)"
                      : "linear-gradient(135deg, #FF5F05, #cc4400)",
                    borderRadius: "8px",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    color: "white", fontWeight: "bold",
                    cursor: isSorted || won ? "not-allowed" : "pointer",
                    opacity: isSorted ? 0.7 : 1,
                    boxShadow: isSorted ? "none" : "0 4px 14px rgba(0,0,0,0.35)",
                    transition: "all 0.3s"
                  }}
                >
                  <span style={{ fontSize: "1.3rem" }}>{grade}</span>
                  <span style={{ fontSize: "0.65rem", marginTop: "4px" }}>pts</span>
                </div>
                <span style={{
                  color: "white", fontSize: "0.7rem",
                  background: isSorted ? "rgba(46,204,113,0.6)" : "rgba(0,0,0,0.45)",
                  padding: "2px 7px", borderRadius: "8px"
                }}>
                  {isSorted ? "sorted" : `#${index + 1}`}
                </span>
              </div>
            );
          })}
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
            <h2 style={{ color: "#FF5F05", textAlign: "center", marginTop: 0 }}>What is Selection Sort?</h2>
            <p style={{ color: "#13294B", lineHeight: "1.8" }}><strong>Selection Sort</strong> works by repeatedly finding the smallest item in the unsorted section and moving it to the front.</p>
            <div style={{ background: "#fff8f0", borderRadius: "12px", padding: "16px", margin: "16px 0", borderLeft: "4px solid #FF5F05" }}>
              <p style={{ margin: 0, color: "#333", lineHeight: "1.8" }}>
                <strong>In this game:</strong> The professor's exams are all out of order. Each round, find the exam with the lowest grade in the unsorted pile and click it. That exam gets placed next in the sorted section!
              </p>
            </div>
            <p style={{ color: "#13294B", fontWeight: "bold" }}>Example:</p>
            <ul style={{ color: "#555", lineHeight: "2.2" }}>
              <li>Exams: 78, 45, 91, 62</li>
              <li>Round 1: find minimum (45) → place it first → 45, 78, 91, 62</li>
              <li>Round 2: find minimum in remaining (62) → place it → 45, 62, 91, 78</li>
              <li>Round 3: find minimum in remaining (78) → place it → 45, 62, 78, 91</li>
              <li>Sorted in just 3 rounds!</li>
            </ul>
            <div style={{ background: "#e8f4fd", borderRadius: "12px", padding: "16px", margin: "16px 0" }}>
              <p style={{ margin: 0, color: "#13294B", lineHeight: "1.8" }}>
                <strong>Big O Notation:</strong> Selection sort always runs in <strong>O(n²)</strong> time regardless of input. Unlike bubble sort, it does not have a best case of O(n) because it always scans the entire unsorted section every round, even if the array is already sorted.
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