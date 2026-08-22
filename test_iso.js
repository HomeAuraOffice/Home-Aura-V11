function getBstIsoString(dateInput = new Date()) {
    const d = new Date(dateInput);
    const bstTime = new Date(d.getTime() + (6 * 60 * 60 * 1000));
    return bstTime.toISOString().replace('Z', '+06:00');
}
console.log(getBstIsoString());
console.log(new Date(getBstIsoString()).toISOString());
