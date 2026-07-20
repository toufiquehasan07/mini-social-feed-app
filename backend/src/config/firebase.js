const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

const base64Key = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
const decodedKey = Buffer.from(base64Key, 'base64').toString('utf8');

if (!getApps().length) {
    initializeApp({
        credential: cert(JSON.parse(decodedKey)),
    });
}

module.exports = getMessaging();
