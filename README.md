# GetFit
A gamified exercise tracker

## 📸 Preview
![image](https://github.com/user-attachments/assets/7554bc00-63a8-4676-bfd6-78781851b238)
![image](https://github.com/user-attachments/assets/9abbb02b-7c5d-4877-a337-77b16a53995e)
![image](https://github.com/user-attachments/assets/ac28a5c7-8955-4c7f-8d95-06a6b757ca14)

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