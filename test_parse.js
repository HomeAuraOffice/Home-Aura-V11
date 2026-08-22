const getBstIsoString = (dateInput = new Date()) => {
  const d = new Date(dateInput);
  const pad = (n) => String(n).padStart(2, '0');
  const dhakaStr = d.toLocaleString('en-US', { timeZone: 'Asia/Dhaka', hour12: false });
  const dhakaDate = new Date(dhakaStr);
  const year = dhakaDate.getFullYear();
  const month = pad(dhakaDate.getMonth() + 1);
  const day = pad(dhakaDate.getDate());
  const hours = pad(dhakaDate.getHours());
  const minutes = pad(dhakaDate.getMinutes());
  const seconds = pad(dhakaDate.getSeconds());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+06:00`;
};
const formatBangladeshDisplayTime = (isoOrDate) => {
  const d = new Date(isoOrDate);
  return d.toLocaleString('en-GB', {
     timeZone: 'Asia/Dhaka',
     day: '2-digit', month: 'short', year: 'numeric',
     hour: '2-digit', minute: '2-digit', hour12: true
  });
};
const iso = getBstIsoString();
console.log("Iso:", iso);
console.log("Display:", formatBangladeshDisplayTime(iso));
