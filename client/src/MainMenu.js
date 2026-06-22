import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://algorithm-storybook.onrender.com";

const levels = [
  {
    id: "binary-search",
    emoji: "🐿️",
    title: "Acorn Hunt",
    algorithm: "Binary Search",
    description: "Help a squirrel find a hidden acorn by always guessing the middle hole. Learn how binary search cuts the options in half every time!",
    available: true
  },
  {
    id: "bubble-sort",
    emoji: "📸",
    title: "Class Photo",
    algorithm: "Bubble Sort",
    description: "The students are all mixed up for the class photo! Swap neighbors to sort them by height and learn how bubble sort works.",
    available: true
  },
  {
    id: "selection-sort",
    emoji: "👨‍🏫",
    title: "Professor's Stack",
    algorithm: "Selection Sort",
    description: "The professor's exams are all mixed up! Find the lowest grade each round and sort the stack.",
    available: true
  },

  {
    id: "insertion-sort",
    emoji: "📚",
    title: "Library Lineup",
    algorithm: "Insertion Sort",
    description: "The library books are all out of order! Insert each book into the correct spot on the shelf and learn how insertion sort works.",
    available: true
  }, 
  {
    id: "merge-sort",
    emoji: "📝",
    title: "Study Groups",
    algorithm: "Merge Sort",
    description: "Two study groups finished reviewing separately. Help them merge into one sorted group for the final exam!",
    available: true
  },
  {
    id: "quick-sort",
    emoji: "💻",
    title: "Debug the Grades",
    algorithm: "Quick Sort",
    description: "The TA needs to rank coding assignments! Pick a pivot score to split submissions into lower and higher piles until everything is sorted.",
    available: true
  }


];

export default function Menu() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState(localStorage.getItem("joinCode") || "");
  const [studentName, setStudentName] = useState(localStorage.getItem("studentName") || "");
  const [joinMessage, setJoinMessage] = useState("");
  const [joinedClassName, setJoinedClassName] = useState(localStorage.getItem("joinedClassName") || "");

  const handleJoinClass = async () => {
    if (!studentName.trim() || !joinCode.trim()) {
      setJoinMessage("Enter your name and a join code.");
      return;
    }
    try {
      const res = await fetch(`${API}/class/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: studentName.trim(), join_code: joinCode.trim().toUpperCase() })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("joinCode", joinCode.trim().toUpperCase());
        localStorage.setItem("studentName", studentName.trim());
        localStorage.setItem("joinedClassName", data.class_name);
        setJoinedClassName(data.class_name);
        setJoinMessage(`Joined ${data.class_name}! Your scores will now count toward your class.`);
      } else {
        setJoinMessage(data.error || "Couldn't join that class.");
      }
    } catch (err) {
      setJoinMessage("Something went wrong. Try again.");
    }
  };

  const handleLeaveClass = () => {
    localStorage.removeItem("joinCode");
    localStorage.removeItem("studentName");
    localStorage.removeItem("joinedClassName");
    setJoinCode("");
    setStudentName("");
    setJoinedClassName("");
    setJoinMessage("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F0EEFF",
      fontFamily: "'Ubuntu', sans-serif",
      padding: "40px 20px"
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{
          fontSize: "3rem", margin: "0",
          color: "#13294B",
          letterSpacing: "1px"
        }}>Algorithm Storybook</h1>
        <p style={{
          color: "#666", fontSize: "1.1rem",
          margin: "12px 0 0"
        }}>Learn algorithms by playing. No lectures required.</p>
      </div>

      {/* Join a Class */}
      <div style={{
        maxWidth: "500px", margin: "0 auto 40px", background: "white",
        borderRadius: "16px", padding: "20px 24px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
      }}>
        {joinedClassName ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: "0 0 8px", color: "#13294B", fontWeight: "bold" }}>
              ✅ Playing as <span style={{ color: "#FF5F05" }}>{studentName}</span> in <span style={{ color: "#FF5F05" }}>{joinedClassName}</span>
            </p>
            <button onClick={handleLeaveClass} style={{
              background: "#f0f0f0", color: "#13294B", border: "none", padding: "8px 16px",
              borderRadius: "8px", fontSize: "0.85rem", cursor: "pointer"
            }}>Leave Class</button>
          </div>
        ) : (
          <>
            <p style={{ margin: "0 0 12px", color: "#13294B", fontWeight: "bold", fontSize: "0.95rem" }}>
              🎓 Join a Class (optional)
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="Your name"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                style={{ flex: "1 1 140px", padding: "10px", borderRadius: "8px", border: "2px solid #ddd", fontSize: "0.9rem", fontFamily: "'Ubuntu', sans-serif" }}
              />
              <input
                type="text"
                placeholder="Join code"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                style={{ flex: "1 1 100px", padding: "10px", borderRadius: "8px", border: "2px solid #ddd", fontSize: "0.9rem", textTransform: "uppercase", fontFamily: "'Ubuntu', sans-serif" }}
              />
              <button onClick={handleJoinClass} style={{
                background: "#FF5F05", color: "white", border: "none", padding: "10px 18px",
                borderRadius: "8px", fontSize: "0.9rem", fontWeight: "bold", cursor: "pointer"
              }}>Join</button>
            </div>
            {joinMessage && <p style={{ margin: "10px 0 0", fontSize: "0.85rem", color: "#666" }}>{joinMessage}</p>}
          </>
        )}
      </div>

      {/* Level cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "24px",
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        {levels.map(level => (
          <div key={level.id}
            onClick={() => level.available && navigate(`/${level.id}`)}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              cursor: level.available ? "pointer" : "not-allowed",
              opacity: level.available ? 1 : 0.6,
              transition: "transform 0.2s, box-shadow 0.2s",
              border: "2px solid transparent",
              borderColor: level.available ? "transparent" : "#eee"
            }}
            onMouseEnter={e => {
              if (level.available) {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
                e.currentTarget.style.background = "#b4ebe7ff";
                e.currentTarget.style.borderColor = "#000000ff";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
              e.currentTarget.style.background = "#ffffffff";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>{level.emoji}</div>
            <div style={{
              display: "inline-block",
              background: level.difficultyColor + "22",
              color: level.difficultyColor,
              padding: "3px 10px", borderRadius: "20px",
              fontSize: "0.75rem", fontWeight: "bold",
              marginBottom: "10px"
            }}>{level.difficulty}</div>
            <h3 style={{ margin: "0 0 4px", color: "#13294B", fontSize: "1.3rem" }}>{level.title}</h3>
            <p style={{ margin: "0 0 12px", color: "#FF5F05", fontSize: "0.85rem", fontWeight: "bold" }}>{level.algorithm}</p>
            <p style={{ margin: 0, color: "#666", fontSize: "0.9rem", lineHeight: "1.6" }}>{level.description}</p>
            {level.available && (
              <div style={{
                marginTop: "20px",
                background: "#13294B",
                color: "white",
                padding: "10px",
                borderRadius: "8px",
                textAlign: "center",
                fontSize: "0.9rem",
                fontWeight: "bold"
              }}>Play Now →</div>
            )}
            {!level.available && (
              <div style={{
                marginTop: "20px",
                background: "#eee",
                color: "#999",
                padding: "10px",
                borderRadius: "8px",
                textAlign: "center",
                fontSize: "0.9rem",
                fontWeight: "bold"
              }}>Coming Soon</div>
            )}
          </div>
        ))}
      </div>

      {/* Teacher Portal link */}
      <div style={{ textAlign: "center", marginTop: "48px" }}>
        <button onClick={() => navigate("/teacher")} style={{
          background: "transparent", color: "#13294B", border: "2px solid #13294B",
          padding: "12px 28px", borderRadius: "12px", fontSize: "0.95rem", fontWeight: "bold",
          cursor: "pointer"
        }}>🍎 Teacher Portal</button>
      </div>
    </div>
  );
}