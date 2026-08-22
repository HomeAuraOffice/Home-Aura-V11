const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  const result = await page.evaluate(async () => {
    try {
      const b1 = new Blob(['1'], {type: 'image/png'});
      const b2 = new Blob(['2'], {type: 'image/png'});
      const f1 = new File([b1], '1.png', {type: 'image/png'});
      const f2 = new File([b2], '2.png', {type: 'image/png'});
      
      const dt = new DataTransfer();
      dt.items.add(f1);
      dt.items.add(f2);
      
      let copied = false;
      document.addEventListener('copy', e => {
        e.clipboardData.items.add(f1);
        e.clipboardData.items.add(f2);
        e.preventDefault();
        copied = true;
      }, {once: true});
      document.execCommand('copy');
      return "SUCCESS: " + copied;
    } catch (e) {
      return e.message;
    }
  });
  console.log("RESULT:", result);
  await browser.close();
})();
