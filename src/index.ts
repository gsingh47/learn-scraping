import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const proxyChain = require('proxy-chain');

puppeteer.use(StealthPlugin())

const url = 'https://store.playstation.com/en-us/category/dc464929-edee-48a5-bcd3-1e6f5250ae80/1';

(async () => {
  const proxyUrl = 'http://brd-customer-hl_fe57479a-zone-datacenter_proxy1:m05k3ai99snq@brd.superproxy.io:22225';
  const updatedProxyUrl = await proxyChain.anonymizeProxy(proxyUrl);

  // Launch the browser
  const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=${updatedProxyUrl}`] });

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto(url);

  const start = performance.now();
  const data = await page.evaluate(() => {
    const productNodes = Array.from(document.querySelectorAll('.psw-link.psw-content-link')); //.psw-product-tile.psw-interactive-root

    const productsData = productNodes.map(node => ({
      type: node.querySelector('.psw-product-tile__product-type')?.textContent,
      title: node.querySelector('.psw-t-body')?.textContent,
      disc: node.querySelector('span[data-qa*="#discount-badge#text"]')?.textContent, // discount: node.querySelector('.psw-body-2.psw-badge__text')?.textContent
      link: node.getAttribute('href'),
      img: node.querySelector('img[data-qa*="#game-art#image#image"]')?.getAttribute('src')
    }));

    return productsData;
  });
  const end = performance.now();

  console.log(data);
  console.log('By attribute: ', end - start); // By class:  2.214250087738037

  // Close browser.
  await browser.close();

  // Clean up
  await proxyChain.closeAnonymizedProxy(updatedProxyUrl, true);
})();

// --------------------
// const url = 'https://webscraper.io/test-sites/e-commerce/allinone';

// (async () => {
//   const proxyUrl = 'http://brd-customer-hl_fe57479a-zone-datacenter_proxy1:m05k3ai99snq@brd.superproxy.io:22225';
//   const updatedProxyUrl = await proxyChain.anonymizeProxy(proxyUrl);

//   // Launch the browser
//   const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=${updatedProxyUrl}`] });

//   // Create a page
//   const page = await browser.newPage();

//   // Go to your site
//   await page.goto(url);

//   const data = await page.evaluate(() => {
//     const productNodes = Array.from(document.querySelectorAll('.product-wrapper.card-body'));

//     const productsData = productNodes.map(node => ({
//       title: node.querySelector('.title')?.textContent,
//       img: node.querySelector('.img-fluid.card-img-top')?.getAttribute('src'),
//       price: node.querySelector('.price.card-title')?.textContent,
//       desc: node.querySelector('.description.card-text')?.textContent
//     }));

//     return productsData;
//   });

//   console.log(data);

//   // Close browser.
//   await browser.close();

//   // Clean up
//   await proxyChain.closeAnonymizedProxy(updatedProxyUrl, true);
// })();

// ------------------------------------------
// const url = 'https://www.whatismyip.com/';

// (async () => {
//   const proxyUrl = 'http://brd-customer-hl_fe57479a-zone-datacenter_proxy1:m05k3ai99snq@brd.superproxy.io:22225';
//   const updatedProxyUrl = await proxyChain.anonymizeProxy(proxyUrl);

//   // Launch the browser
//   const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=${updatedProxyUrl}`] });

//   // Create a page
//   const page = await browser.newPage();

//   // Go to your site
//   await page.goto(url);

//   await new Promise(resolve => setTimeout(resolve, 3000));
//   await page.screenshot({ path: 'ip-address-proxy.png' });

//   // Close browser.
//   await browser.close();

//   // Clean up
//   await proxyChain.closeAnonymizedProxy(updatedProxyUrl, true);
// })();

