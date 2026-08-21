function getBstDateString(date) {
    // Return YYYY-MM-DD in UTC+6
    const d = new Date((typeof date === "string" ? new Date(date) : date).getTime() + (6 * 60 * 60 * 1000));
    return d.toISOString().split("T")[0];
}
console.log(getBstDateString(new Date()));
