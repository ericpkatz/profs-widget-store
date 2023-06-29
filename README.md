# setup

- create database
- npm install
- npm run start:dev

# secrets.js

- for local development create secrets.js in server folder

```
process.env.API_KEY='YOUR GOOGLE MAPS PLACES API KEY';
process.env.CLIENT_ID='YOUR GITHUB CLIENT_ID';
process.env.CLIENT_SECRET='YOUR GITHUB CLIENT_SECRET';

```

# Deployment

- set DATABASE_URL environment variable
- set JWT environment variable
- set API_KEY, CLIENT_ID, CLIENT_SECRET environment variables
