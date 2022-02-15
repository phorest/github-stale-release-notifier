const createReleaseData = (data) => {
    const defaultReleaseData = {
        name: "Release 2.0",
        created_at: "2021-03-27T07:37:09Z",
        published_at: "2021-04-27T07:37:09Z",
        Tag: "2.0",
        author: "sameer",
    };

    return { ...defaultReleaseData, ...data };
};

const todayPlusHours = (hours) => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date;
};

module.exports = {
    createReleaseData,
    todayPlusHours,
};
