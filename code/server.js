const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const mongoHandler = require('./mongo');
const jwt = require('jsonwebtoken');
const google_authenticator = require('./google_authenticator');

const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

const secretKey = 'aishwary';

function calculateSHA256(input) {
    const hash = crypto.createHash('sha256');
    hash.update(input);
    const hashedValue = hash.digest('hex');
    return hashedValue;
}

async function verifyUser(email, token, type, res) {
    let email_from_verified_source = null;
    if (type == 'jwt') {
        email_from_verified_source = jwt.verify(token, secretKey);
    }
    if (type == 'google') {
        let payload = await google_authenticator.verify(token);
        email_from_verified_source = payload.email;
    }
    console.log("Call recieved for email " + email_from_verified_source);
    if (email_from_verified_source != email) {
        return false;
    }
    else {
        return true;
    }
}

async function getGoogleEmail(token) {
    let payload = await google_authenticator.verify(token);
    console.log(payload);
    email_from_verified_source = payload.email;
    let name = payload.name;
    return { email: email_from_verified_source, name: name };
}

app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
})

app.post('/login', async (req, res) => {
    console.log(req.body);
    let { type } = req.body;
    let email1 = "";
    let name1 = "";
    if (type == 'google' || true) {
        let { token } = req.body;
        let { email, name } = await getGoogleEmail(token);
        email1 = email;
        name1 = name;
    }
    user = {
        email: email1,
        name: name1
    };
    let result = await mongoHandler.get_user(email1);
    if (result == null) {
        mongoHandler.add_user(user, null);
    }
    res.status(200).json(user);
})

// POST request endpoint to save user data
app.post('/add_user', (req, res) => {
    const { email, name, password, phoneNumber } = req.body;
    password_hashed = calculateSHA256(password);
    // Create a new user object
    const user = { email, name, password_hashed, phoneNumber };
    console.log(user);
    // Save the user data in the list
    mongoHandler.add_user(user, res);

});

// POST request endpoint to save user data
app.post('/add_order', (req, res) => {
    console.log(req.body);
    const { email, orderNumber, amount } = req.body;
    // Create a new user object
    const order = { email, orderNumber, amount };
    console.log(order);
    // Save the user data in the list
    mongoHandler.add_order(order, res);
});

// POST request endpoint to save user data
app.post('/get_orders', (req, res) => {
    let { email } = req.body
    mongoHandler.get_orders(email, res);
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 3000');
});
