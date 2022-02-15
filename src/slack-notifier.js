const axios = require("axios");
const core = require("@actions/core");

async function sendToSlack(webhookUrl, msgPayload) {
    try {
        await axios.post(webhookUrl, msgPayload);
    } catch (err) {
        if (err.response) {
            core.setFailed(err.response.data);
        }
        core.setFailed(err.message);
    }
}

module.exports = {
    sendToSlack,
};
