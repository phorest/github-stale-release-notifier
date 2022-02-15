const { getLatestRelease } = require("../src/github-client");
const { getOctokit } = require("@actions/github");
const { createReleaseData } = require("./mockData");

const token = "dummytoken";

jest.mock("@actions/github", () => ({
    getOctokit: jest.fn(),
    context: { repo: { owner: "user", repo: "testrepo" } },
}));

test("Gets the latest release of the repository", async () => {
    const mockReleaseData = createReleaseData({
        name: "Latest Release 1.0",
        created_at: todayPlusHours(-25),
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
    const latestReleaseResponse = await getLatestRelease(token);
    expect(latestReleaseResponse.name).toStrictEqual("Latest Release 1.0");
});

const todayPlusHours = (hours) => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date;
};
