import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://algorithm-storybook.onrender.com";

const GAME_LABELS = {
  "binary-search": "Acorn Hunt",
  "bubble-sort": "Class Photo",
  "selection-sort": "Professor's Stack",
  "insertion-sort": "Library Lineup",
  "merge-sort": "Study Groups",
  "quick-sort": "Debug the Grades"
};

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .teacher-input:focus {
    outline: none;
    border-color: #b4ebe7ff !important;
  }
`;

export default function Teacher() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("choose");

  const [teacherName, setTeacherName] = useState("");
  const [className, setClassName] = useState("");
  const [createdClass, setCreatedClass] = useState(null);
  const [createError, setCreateError] = useState("");

  const [lookupCode, setLookupCode] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [lookupError, setLookupError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateClass = async () => {
    if (!teacherName.trim() || !className.trim()) {
      setCreateError("Please enter both your name and a class name.");
      return;
    }
    setCreateError("");
    try {
      const res = await fetch(`${API}/class/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacher_name: teacherName.trim(), class_name: className.trim() })
      });
      const data = await res.json();
      setCreatedClass(data);
    } catch (err) {
      setCreateError("Something went wrong. Try again.");
    }
  };

  const handleLookupClass = async () => {
    if (!lookupCode.trim()) {
      setLookupError("Please enter a join code.");
      return;
    }
    setLookupError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/class/${lookupCode.trim().toUpperCase()}`);
      const data = await res.json();
      if (res.ok) {
        setDashboard(data);
      } else {
        setLookupError(data.error || "Class not found.");
        setDashboard(null);
      }
    } catch (err) {
      setLookupError("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
        fontFamily: "'Ubuntu', sans-serif", padding: "40px 20px", position: "relative"
      }}>
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "#F0EEFF", zIndex: 0
        }} />

        <div style={{ zIndex: 10, width: "100%", maxWidth: "560px" }}>
          <h1 style={{ color: "#FF5F05", textAlign: "center", fontSize: "2.2rem", marginBottom: "4px" }}>
            Teacher Portal
          </h1>
          <p style={{ color: "#13294B", textAlign: "center", marginBottom: "28px", opacity: 0.75 }}>
            Create a class or view your students' progress
          </p>

          {mode === "choose" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <button onClick={() => setMode("create")} style={{
                background: "#b4ebe7ff", color: "#13294B", border: "none", padding: "18px",
                borderRadius: "14px", fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer",
                boxShadow: "0 4px 14px rgba(0,0,0,0.3)"
              }}>+ Create a New Class</button>
              <button onClick={() => setMode("dashboard")} style={{
                background: "white", color: "#13294B", border: "none", padding: "18px",
                borderRadius: "14px", fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer",
                boxShadow: "0 4px 14px rgba(0,0,0,0.3)"
              }}>View My Class Dashboard</button>
              <button onClick={() => navigate("/")} style={{
                background: "transparent", color: "#13294B", border: "2px solid rgba(19,41,75,0.3)",
                padding: "14px", borderRadius: "14px", fontSize: "1rem", cursor: "pointer", marginTop: "8px"
              }}>← Back to Main Menu</button>
            </div>
          )}

          {mode === "create" && !createdClass && (
            <div style={{ background: "white", borderRadius: "18px", padding: "28px", animation: "fadeIn 0.3s ease-out" }}>
              <h2 style={{ color: "#13294B", marginTop: 0 }}>Create Your Class</h2>
              <input
                className="teacher-input"
                type="text"
                placeholder="Teacher name"
                value={teacherName}
                onChange={e => setTeacherName(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "2px solid #ddd", fontSize: "1rem", marginBottom: "12px", boxSizing: "border-box", fontFamily: "'Ubuntu', sans-serif" }}
              />
              <input
                className="teacher-input"
                type="text"
                placeholder="Class name (e.g.  Period 7 AP CSA)"
                value={className}
                onChange={e => setClassName(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "2px solid #ddd", fontSize: "1rem", marginBottom: "12px", boxSizing: "border-box", fontFamily: "'Ubuntu', sans-serif" }}
              />
              {createError && <p style={{ color: "#c0392b", fontWeight: "bold", fontSize: "0.9rem" }}>{createError}</p>}
              <button onClick={handleCreateClass} style={{
                width: "100%", background: "#FF5F05", color: "white", border: "none", padding: "14px",
                borderRadius: "10px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", marginBottom: "10px"
              }}>Create Class</button>
              <button onClick={() => setMode("choose")} style={{
                width: "100%", background: "#f0f0f0", color: "#13294B", border: "none", padding: "12px",
                borderRadius: "10px", fontSize: "0.95rem", cursor: "pointer"
              }}>← Back</button>
            </div>
          )}

          {mode === "create" && createdClass && (
            <div style={{ background: "white", borderRadius: "18px", padding: "28px", textAlign: "center", animation: "fadeIn 0.3s ease-out" }}>
              <h2 style={{ color: "#2d8a1e", marginTop: 0 }}>Class Created</h2>
              <p style={{ color: "#13294B" }}>Share this join code with your students:</p>
              <div style={{
                background: "#fff8f0", border: "3px dashed #FF5F05", borderRadius: "14px",
                padding: "20px", margin: "16px 0", fontSize: "2.2rem", fontWeight: "bold",
                letterSpacing: "4px", color: "#FF5F05"
              }}>
                {createdClass.join_code}
              </div>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>
                Students enter this code on the main menu before playing. Their scores will show up in your dashboard.
              </p>
              <button onClick={() => { setMode("dashboard"); setLookupCode(createdClass.join_code); }} style={{
                width: "100%", background: "#13294B", color: "white", border: "none", padding: "14px",
                borderRadius: "10px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", marginTop: "10px", marginBottom: "10px"
              }}>View Dashboard</button>
              <button onClick={() => navigate("/")} style={{
                width: "100%", background: "#f0f0f0", color: "#13294B", border: "none", padding: "12px",
                borderRadius: "10px", fontSize: "0.95rem", cursor: "pointer"
              }}>← Back to Main Menu</button>
            </div>
          )}

          {mode === "dashboard" && !dashboard && (
            <div style={{ background: "white", borderRadius: "18px", padding: "28px", animation: "fadeIn 0.3s ease-out" }}>
              <h2 style={{ color: "#13294B", marginTop: 0 }}>View Class Dashboard</h2>
              <input
                className="teacher-input"
                type="text"
                placeholder="Enter your join code"
                value={lookupCode}
                onChange={e => setLookupCode(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "2px solid #ddd", fontSize: "1rem", marginBottom: "12px", boxSizing: "border-box", fontFamily: "'Ubuntu', sans-serif", textTransform: "uppercase" }}
              />
              {lookupError && <p style={{ color: "#c0392b", fontWeight: "bold", fontSize: "0.9rem" }}>{lookupError}</p>}
              <button onClick={handleLookupClass} disabled={loading} style={{
                width: "100%", background: "#FF5F05", color: "white", border: "none", padding: "14px",
                borderRadius: "10px", fontSize: "1rem", fontWeight: "bold", cursor: loading ? "default" : "pointer", marginBottom: "10px", opacity: loading ? 0.7 : 1
              }}>{loading ? "Loading..." : "View Dashboard"}</button>
              <button onClick={() => { setMode("choose"); setDashboard(null); }} style={{
                width: "100%", background: "#f0f0f0", color: "#13294B", border: "none", padding: "12px",
                borderRadius: "10px", fontSize: "0.95rem", cursor: "pointer"
              }}>← Back</button>
            </div>
          )}

          {mode === "dashboard" && dashboard && (
            <div style={{ background: "white", borderRadius: "18px", padding: "28px", animation: "fadeIn 0.3s ease-out" }}>
              <h2 style={{ color: "#13294B", marginTop: 0 }}>{dashboard.class_name}</h2>
              <p style={{ color: "#666", marginTop: "-8px", marginBottom: "16px" }}>
                Taught by {dashboard.teacher_name} · Join code: <strong>{dashboard.join_code}</strong>
              </p>

              {dashboard.students.length === 0 ? (
                <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>
                  No students have joined yet. Share the join code to get started!
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {dashboard.students.map((student, i) => (
                    <div key={i} style={{ background: "#f9f9f9", borderRadius: "12px", padding: "14px 16px" }}>
                      <p style={{ margin: "0 0 8px", fontWeight: "bold", color: "#13294B" }}>{student.name}</p>
                      {Object.keys(student.scores).length === 0 ? (
                        <p style={{ margin: 0, color: "#999", fontSize: "0.85rem" }}>No games played yet</p>
                      ) : (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {Object.entries(student.scores).map(([game, steps]) => (
                            <span key={game} style={{
                              background: "#fff8f0", border: "1px solid #FF5F05", borderRadius: "8px",
                              padding: "4px 10px", fontSize: "0.8rem", color: "#13294B"
                            }}>
                              {GAME_LABELS[game] || game}: <strong>{steps}</strong>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button onClick={() => { setMode("choose"); setDashboard(null); setLookupCode(""); }} style={{
                width: "100%", background: "#13294B", color: "white", border: "none", padding: "14px",
                borderRadius: "10px", fontSize: "1rem", fontWeight: "bold", cursor: "pointer", marginTop: "18px"
              }}>← Back</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}