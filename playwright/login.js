const { chromium } = require('playwright');

(async () => {

    const browser = await chromium.launch({
        headless: true
    });

    const page = await browser.newPage();

    await page.goto("https://dev-ui.schneider.xrdashboard.com/login/Schneider");

    await page.fill('input[type="email"]', process.env.APP_USERNAME);
    await page.fill('input[type="password"]', process.env.APP_PASSWORD);

    await page.click('button[type="submit"]');

    await page.waitForLoadState("networkidle");

    console.log("Current URL:", page.url());

    console.log("Login Success");

    await browser.close();

})();