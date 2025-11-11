# Profile Portal v2
Routes:
- `/work-dashboard` — Executive dashboard (interactive)
- `/work-cv` — Minimalist printable visual CV
- `/health` — Private health profile (passphrase gate)

## Local
npm i
cp .env.example .env  # set VITE_HEALTH_PASS
npm run dev

## Docker
docker build -t profile-portal:latest .
docker run -p 8080:80 profile-portal:latest


changing 
