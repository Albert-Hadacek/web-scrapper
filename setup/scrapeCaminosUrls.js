const scrapeCaminosUrls = async (browser, url) => {
    let page = await browser.newPage()
    console.log(`Navigating to ${url}...`)
    await page.setDefaultNavigationTimeout(0)
    await page.goto(url)

    const etapesUrls = await page.evaluate(() => {
        // eslint-disable-next-line no-undef
        const els = document.querySelectorAll(
            '.pane-menu-menu-caminos-alpha .nav-pills a'
        )
        return [...els].map((el) => ({
            url: el.href,
            title: el.textContent,
            camino: el.textContent
                .replace(/\s/g, '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
        }))
    })

    await page.close()
    return etapesUrls
}
export default scrapeCaminosUrls
