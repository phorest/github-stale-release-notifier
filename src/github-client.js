const github = require("@actions/github");

async function getLatestRelease(token) {
    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;

    const { data } = await octokit.rest.repos.listReleases({
        owner,
        repo,
    });

    return data.length > 0 ? data[0] : null;
}

module.exports = {
    getLatestRelease,
};
