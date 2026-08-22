const d = new Date("2026-08-21T18:30:00Z"); // this is 00:30 in Dhaka
console.log(d.toLocaleString('en-US', { timeZone: 'Asia/Dhaka', hour12: false }));
