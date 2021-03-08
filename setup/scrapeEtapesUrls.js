const scrapeCaminoFrancesUrls = async (browser, url) => {
    let page = await browser.newPage()
    console.log(`Navigating to ${url}...`)
    await page.setDefaultNavigationTimeout(0)
    await page.goto(url)

    const etapesUrls = await page.evaluate(() => {
        // eslint-disable-next-line no-undef
        const els = document.querySelectorAll('.camino-etapa a')
        return [...els].map((el) => ({
            url: el.href,
            title: el.textContent,
            etape: el.textContent.replace(/\s/g, ''),
        }))
    })

    await page.close()
    return etapesUrls
}
export default scrapeCaminoFrancesUrls
