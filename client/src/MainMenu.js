import { useNavigate } from "react-router-dom";

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
    emoji: "🎓",
    title: "Class Photo",
    algorithm: "Bubble Sort",
    description: "The students are all mixed up for the class photo! Swap neighbors to sort them by height and learn how bubble sort works.",
    available: true
  },
  {
    id: "selection-sort",
    emoji: "🔍",
    title: "Professor's Stack",
    algorithm: "Selection Sort",
    description: "The professor's exams are all mixed up! Find the lowest grade each round and sort the stack.",
    available: true
  },
  {
    id: "linear-search",
    emoji: "📚",
    title: "Coming Soon",
    algorithm: "Linear Search",
    description: "Another search challenge is coming!",
    available: false
  }
];

export default function Menu() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8f9fa",
      fontFamily: "Georgia, serif",
      padding: "40px 20px"
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{
          fontSize: "3rem", margin: "0",
          color: "#13294B",
          letterSpacing: "1px"
        }}>Algorithm Storybook</h1>
        <p style={{
          color: "#666", fontSize: "1.1rem",
          margin: "12px 0 0"
        }}>Learn computer science algorithms through interactive stories</p>
        <div style={{
          width: "60px", height: "4px",
          background: "#FF5F05",
          margin: "16px auto 0",
          borderRadius: "2px"
        }} />
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
                e.currentTarget.style.borderColor = "#FF5F05";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
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
    </div>
  );
}