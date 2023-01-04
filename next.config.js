const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  env: {
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_SCOPE: 'openid profile',
    REDIRECT_URI: process.env.REDIRECT_URI || 'http://localhost:3000/api/callback',
    POST_LOGOUT_REDIRECT_URI: process.env.POST_LOGOUT_REDIRECT_URI || 'http://localhost:3000/',
    SESSION_COOKIE_SECRET: process.env.SESSION_COOKIE_SECRET,
    SESSION_COOKIE_LIFETIME: 7200,

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
