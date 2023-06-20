const { OAuth2Client } = require('google-auth-library');

let CLIENT_ID = "371060853820-kksdf5b9nqd3ge3qd7imqk31cl61tpk9.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

async function verifyToken(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
}

module.exports.verify = verifyToken;