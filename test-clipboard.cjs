const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  const result = await page.evaluate(async () => {
    try {
      const b1 = new Blob(['1'], {type: 'text/plain'});
      const b2 = new Blob(['2'], {type: 'text/html'});
      await navigator.clipboard.write([
        new ClipboardItem({'text/plain': b1}),
        new ClipboardItem({'text/html': b2})
      ]);
      return "SUCCESS";
    } catch (e) {
      return e.message;
    }
  });
  console.log("RESULT:", result);
  await browser.close();
})();
