const core = require("@actions/core");
const axios = require("axios");
const { createReleaseData, todayPlusHours } = require("./mockData");
const { verifyLastRelease } = require("../src/stale-release-verifier");
const { getOctokit } = require("@actions/github");

jest.mock("@actions/core");
jest.mock("axios");
jest.mock("@actions/github", () => ({
    getOctokit: jest.fn(),
    context: { repo: { owner: "user", repo: "testrepo" } },
}));

test("It should process stale release with a notification", async () => {
    core.getInput
        .mockReturnValueOnce("github-token")
        .mockReturnValueOnce("1")
        .mockReturnValueOnce("https://localhost/slack");

    const draftCreatedAt = todayPlusHours(-25).toISOString();
    const mockReleaseData = createReleaseData({
        name: "Latest Release 1.0",
        draft: true,
        created_at: draftCreatedAt,
        body: "release body",
        html_url: "http://github/repo/release",
    });
    getOctokit.mockReturnValue({
        rest: {
            repos: {
                listReleases: async () => ({
                    data: [mockReleaseData],
                }),
            },
        },
    });

    await verifyLastRelease();

    expect(axios.post).toHaveBeenCalledWith("https://localhost/slack", {
        text: "*testrepo release <https://github.com/user/testrepo/releases|Latest Release 1.0> is waiting to be published*: \n\n>>>release body",
        type: "mrkdwn",
    });
});

test("It should process non stale release without notification", async () => {
    core.getInput
        .mockReturnValueOnce("github-token")
        .mockReturnValueOnce("1")
        .mockReturnValueOnce("https://localhost/slack");

    const draftCreatedAt = todayPlusHours(-10).toISOString();
    const mockReleaseData = createReleaseData({
        name: "Latest Release 1.0",
        draft: true,
        created_at: draftCreatedAt,
    });
    getOctokit.mockReturnValue({
        rest: {
            repos: {
                listReleases: async () => ({
                    data: [mockReleaseData],
                }),
            },
        },
    });

    await verifyLastRelease();
    expect(core.info).toHaveBeenCalledWith(
        `Last Release: Latest Release 1.0 created at: ${draftCreatedAt} is not stale yet`
    );
});

test("It should process non draft release without notification", async () => {
    core.getInput
        .mockReturnValueOnce("github-token")
        .mockReturnValueOnce("1")
        .mockReturnValueOnce("https://localhost/slack");

    const mockReleaseData = createReleaseData({
        name: "Latest Release 1.0",
        draft: false,
    });
    getOctokit.mockReturnValue({
        rest: {
            repos: {
                listReleases: async () => ({
                    data: [mockReleaseData],
                }),
            },
        },
    });

    await verifyLastRelease();
    expect(core.info).toHaveBeenCalledWith("No draft release found");
});

test("It should process empty list of release", async () => {
    core.getInput
        .mockReturnValueOnce("github-token")
        .mockReturnValueOnce("1")
        .mockReturnValueOnce("https://localhost/slack");

    getOctokit.mockReturnValue({
        rest: {
            repos: {
                listReleases: async () => ({
                    data: [],
                }),
            },
        },
    });

    await verifyLastRelease();
    expect(core.info).toHaveBeenCalledWith("No draft release found");
});
