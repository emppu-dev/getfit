# GetFit
A gamified exercise tracker

## 📸 Preview
![image](https://github.com/user-attachments/assets/493ab7f2-f6e0-444c-a465-6b60e41d49d6)
![image](https://github.com/user-attachments/assets/dc16bd57-3ab7-4711-b71c-476652bfdbc4)

## 📝 Todo
- [x] PocketBase setup
- [x] User authentication
- [x] XP and level system
- [x] Exercise tracking
- [x] Exercise history
- [x] Integrate [free-exercise-db](https://github.com/yuhonas/free-exercise-db)
- [x] Workout timer
- [x] Styling
- [ ] Skills / achievements
- [ ] Calender and rest day logging
- [ ] Streaks
- [ ] Friends leaderboard


## 📍 Running Locally
```bash
npm install
npm run build
node build
```

## 🐳 Running with Docker
```bash
docker build . -t getfit
docker run -d -p 5050:5050 --name getfit getfit
```