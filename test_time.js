const str = "2026-08-21 21:30"; // What getBangladeshTimeString outputs
const d = new Date(str);
console.log(d.toLocaleString('en-GB', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: true }));
