const formatBangladeshDisplayTime = (isoOrDate) => {
  if (!isoOrDate) return 'N/A';
  let str = String(isoOrDate);
  // backwards compatibility for old format "YYYY-MM-DD HH:mm" or "YYYY-MM-DD HH:mm:ss"
  if (str.length >= 16 && str.length <= 19 && !str.includes('T') && !str.includes('+') && !str.includes('Z')) {
     str = str.replace(' ', 'T') + '+06:00';
  }
  const d = new Date(str);
  return d.toLocaleString('en-GB', {
     timeZone: 'Asia/Dhaka',
     day: '2-digit', month: 'short', year: 'numeric',
     hour: '2-digit', minute: '2-digit', hour12: true
  });
};
console.log(formatBangladeshDisplayTime("2026-08-21 21:30"));
console.log(formatBangladeshDisplayTime("2026-08-21 21:30:00"));
console.log(formatBangladeshDisplayTime("2026-08-21T21:30:00+06:00"));
console.log(formatBangladeshDisplayTime("2026-08-21T15:30:00.000Z"));
