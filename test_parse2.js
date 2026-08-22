const formatBangladeshDisplayTime = (isoOrDate) => {
  const d = new Date(isoOrDate);
  return d.toLocaleString('en-GB', {
     timeZone: 'Asia/Dhaka',
     day: '2-digit', month: 'short', year: 'numeric',
     hour: '2-digit', minute: '2-digit', hour12: true
  });
};
console.log(formatBangladeshDisplayTime("2026-08-21 21:30"));
