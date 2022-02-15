const github = require("@actions/github");

async function getLatestRelease(token) {
    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;

    const { data } = await octokit.rest.repos.getLatestRelease({
        owner,
        repo,
    });

    return data;
}

module.exports = {
    getLatestRelease,
};
