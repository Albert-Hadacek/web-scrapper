import pupeteer from 'puppeteer'

const startBrowser = async () => {
    let browser
    try {
        console.log('Opening the browser')
        browser = await pupeteer.launch({
            headless: true,
            args: ['--disable-setuid-sandbox'],
            ignoreHTTPSErrors: true,
        })
    } catch (err) {
        console.log('Could not create a browser instance => : ', err)
    }
    return browser
}

export default startBrowser
