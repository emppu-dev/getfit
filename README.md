# GetFit
A gamified exercise tracker

## Running Locally
```bash
npm install
npm run build
node build
```

## Running with Docker
```bash
docker build . -t getfit
docker run -d -p 5050:5050 --name getfit getfit
```