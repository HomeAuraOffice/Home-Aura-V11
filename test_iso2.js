function getBstIsoString(dateInput = new Date()) {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return new Date().toISOString();
    const pad = (n) => String(n).padStart(2, '0');
    // We want the string to strictly represent the Dhaka time
    // An alternative is to just format it explicitly
    const dhakaStr = d.toLocaleString('en-US', { timeZone: 'Asia/Dhaka', hour12: false });
    // dhakaStr looks like "8/21/2026, 21:33:01"
    const dhakaDate = new Date(dhakaStr);
    const year = dhakaDate.getFullYear();
    const month = pad(dhakaDate.getMonth() + 1);
    const day = pad(dhakaDate.getDate());
    const hours = pad(dhakaDate.getHours());
    const minutes = pad(dhakaDate.getMinutes());
    const seconds = pad(dhakaDate.getSeconds());
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+06:00`;
}
console.log(getBstIsoString());
console.log(new Date(getBstIsoString()).toISOString());
