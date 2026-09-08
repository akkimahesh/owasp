const { chromium } = require("playwright");

(async () => {

    const browser = await chromium.launch({
        headless: true,
        proxy: {
            server: "http://127.0.0.1:8080"
        }
    });

    const context = await browser.newContext({
        ignoreHTTPSErrors: true
    });

    const page = await context.newPage();

    await page.goto("http://devopswithmahesh.shop/");

    await page.fill('input[type="email"]', process.env.APP_USERNAME);
    await page.fill('input[type="password"]', process.env.APP_PASSWORD);

    await page.click('button[type="submit"]');

    await page.waitForLoadState("networkidle");

    console.log("Current URL:", page.url());

    await browser.close();

})();
