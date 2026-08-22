const { writeFileSync } = require('fs');
writeFileSync('test.html', `
<!DOCTYPE html>
<html><body>
<script>
async function copy() {
  const canvas = document.createElement('canvas');
  canvas.width = 10; canvas.height = 10;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'red'; ctx.fillRect(0,0,10,10);
  const blob1 = await new Promise(r => canvas.toBlob(r));
  ctx.fillStyle = 'blue'; ctx.fillRect(0,0,10,10);
  const blob2 = await new Promise(r => canvas.toBlob(r));
  try {
    await navigator.clipboard.write([
      new ClipboardItem({'image/png': blob1}),
      new ClipboardItem({'image/png': blob2})
    ]);
    console.log("Success");
  } catch (e) {
    console.error("Error:", e);
  }
}
copy();
</script>
</body></html>
`);
