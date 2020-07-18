const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: 'elevorg-talerliste.firebaseapp.com',
    FIREBASE_DATABASE_URL: 'https://elevorg-talerliste.firebaseio.com',
    FIREBASE_PROJECT_ID: 'elevorg-talerliste',
    FIREBASE_STORAGE_BUCKET: 'elevorg-talerliste.appspot.com',
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
  },
}
