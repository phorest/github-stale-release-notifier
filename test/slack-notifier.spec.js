const { sendToSlack } = require("../src/slack-notifier");
const axios = require("axios");
const core = require("@actions/core");

jest.mock("@actions/core");
jest.mock("axios");

const testUrl = "https://localhost/slack-webhook";

test("should post to slack successfully", async () => {
    const payload = { text: "", type: "mrkdwn" };
    await sendToSlack(testUrl, payload);

    expect(axios.post).toHaveBeenCalledWith(testUrl, payload);
});

test("expect to record an error when slack sending fails with reponse", async () => {
    const message = "Network Error";
    const error = new Error(message);
    error.response = { data: "some error data" };
    axios.post.mockRejectedValueOnce(error);

    const payload = { text: "", type: "mrkdwn" };
    await sendToSlack(testUrl, payload);

    expect(core.setFailed).toHaveBeenCalledWith(error.response.data);
    expect(core.setFailed).toHaveBeenCalledWith(error.message);
});

test("expect to record an error when slack sending fails without reponse", async () => {
    const message = "Network Error";
    const error = new Error(message);
    axios.post.mockRejectedValueOnce(error);

    const payload = { text: "", type: "mrkdwn" };
    await sendToSlack(testUrl, payload);

    expect(core.setFailed).toHaveBeenCalledWith(error.message);
});
