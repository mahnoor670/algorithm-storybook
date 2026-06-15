# Algorithm Storybook

A full-stack educational web app that teaches sorting and searching algorithms through interactive mini-games with a real-time leaderboard.

**Live Demo:** https://algorithm-storybook.vercel.app  
**Backend API:** https://algorithm-storybook.onrender.com

---

## Tech Stack

**Frontend:** React, JavaScript, HTML/CSS  
**Backend:** Python, Flask, SQLAlchemy  
**Database:** SQLite  
**Architecture:** REST API  
**Deployment:** Vercel (frontend), Render (backend)

---

## Games

| Algorithm | Level | Status |
|---|---|---|
| Binary Search | Acorn Hunt | Live |
| Bubble Sort | Class Photo | Live |
| Selection Sort | Professor's Stack | Live |
| Insertion Sort | Library Lineup | Live |
| Merge Sort | Study Groups | Live |
| Quick Sort | Debug the Grades | Live |

Each game includes an interactive leaderboard that saves player scores to a SQLite database via a RESTful Flask API.

---

## Features

- Six interactive algorithm mini-games for introductory CS learners
- Real-time leaderboard with persistent score storage per game
- Educational popups explaining Big O notation and algorithm concepts
- Optimal move feedback during gameplay to reinforce learning
- Fully deployed and accessible via live URL

---

## How to Run

### Backend
```bash
pip install flask flask-sqlalchemy flask-cors
python app.py
```

### Frontend
```bash
cd client
npm install
npm start
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /start | Start a new binary search game |
| POST | /guess | Submit a hole guess |
| POST | /bubble-sort/swap | Submit a swap |
| POST | /selection-sort/pick | Pick the minimum element |
| POST | /insertion-sort/insert | Insert a book into position |
| POST | /merge-sort/pick | Pick the next merge element |
| POST | /quick-sort/assign | Assign element to left or right |
| GET | /leaderboard | Fetch top 10 scores for a game |
| POST | /leaderboard | Save a player score |
