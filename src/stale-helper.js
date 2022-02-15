function isStale(date, days) {
    const staleDate = new Date(date);
    staleDate.setDate(date.getDate() + days);

    return new Date() >= staleDate;
}

module.exports = {
    isStale,
};
