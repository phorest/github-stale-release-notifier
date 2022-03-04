const core = require("@actions/core");
const github = require("@actions/github");

const { getLatestRelease } = require("./github-client");
const { isStale } = require("./stale-helper");
const { sendToSlack } = require("./slack-notifier");

async function verifyLastRelease() {
    const token = core.getInput("github-token", { required: true });
    const staleDays = Number(core.getInput("stale-days"));
    const slackWebhookUrl = core.getInput("slack-webhook-url", {
        required: true,
    });

    const lastRelease = await getLatestRelease(token);

    if (!lastRelease || !lastRelease.draft) {
        core.info("No draft release found");
        return;
    }

    if (isStale(new Date(lastRelease.created_at), staleDays)) {
        await sendSlackNotification(slackWebhookUrl, lastRelease);
    } else {
        core.info(
            `Last Release: ${lastRelease.name} created at: ${lastRelease.created_at} is not stale yet`
        );
    }
}

const sendSlackNotification = async (slackWebhookUrl, lastRelease) => {
    const { owner, repo } = github.context.repo;
    const payload = prepareSlackPayload(owner, repo, lastRelease);

    core.info(`Sending slack notification for release: ${lastRelease.name}`);
    await sendToSlack(slackWebhookUrl, payload);
};

const prepareSlackPayload = (owner, repo, releaseData) => {
    return {
        type: "mrkdwn",
        text: `*${repo} release <https://github.com/${owner}/${repo}/releases|${releaseData.name}> is waiting to be published*: \n\n>>>${releaseData.body}`,
    };
};

module.exports = {
    verifyLastRelease,
};
