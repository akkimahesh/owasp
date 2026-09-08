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

    await page.goto("http://devopswithmahesh.shop/login", {
        waitUntil: "networkidle",
        timeout: 60000
    });

    console.log("Current URL:", page.url());
    console.log("Title:", await page.title());

    await page.fill(
        'input[placeholder="Enter mobile or username"]',
        process.env.APP_USERNAME
    );

    await page.fill(
        'input[placeholder="Enter password"]',
        process.env.APP_PASSWORD
    );

    await page.click('button[type="submit"]');

    await page.waitForLoadState("networkidle");

    console.log("Login URL:", page.url());

    await browser.close();

})();
