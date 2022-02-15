const { isStale } = require("../src/stale-helper");

test("should correctly recognize a stale date", () => {
    expect(isStale(new Date(), 1)).toBe(false);

    expect(isStale(todayPlusHours(-2), 1)).toBe(false);
    expect(isStale(todayPlusHours(-25), 1)).toBe(true);
});

const todayPlusHours = (hours) => {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date;
};
