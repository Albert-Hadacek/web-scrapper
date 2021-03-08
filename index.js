import fs from 'fs'
import startBrowser from './setup/browser.js'
import scrapeEtapePage from './setup/scrapeEtapePage.js'
import scrapeEtapesUrls from './setup/scrapeEtapesUrls.js'
import scrapeCaminosUrls from './setup/scrapeCaminosUrls.js'

const main = async () => {
    const browserInstance = await startBrowser()
    const url = 'https://www.gronze.com'

    let caminosUrls = await scrapeCaminosUrls(browserInstance, url)
    const caminosUrlsJSON = JSON.stringify(caminosUrls)

    if (!fs.existsSync('data/caminos')) {
        fs.mkdirSync('data')
        fs.mkdirSync('data/caminos')
    }

    fs.writeFileSync(
        `${process.cwd()}/data/caminos/caminos.json`,
        caminosUrlsJSON,
        (err) => {
            if (err) throw err
            console.log('Data successfully saved')
        }
    )
    for (const { url, camino } of caminosUrls) {
        try {
            const etapesUrls = await scrapeEtapesUrls(browserInstance, url)

            let albergues = []
            for (const { url, etape } of etapesUrls) {
                const etapes = await scrapeEtapePage(
                    browserInstance,
                    url,
                    etape
                )
                albergues = [...albergues, ...etapes]
            }
            const alberguesJSON = JSON.stringify({ data: albergues })

            var dir = `${process.cwd()}/data/${camino}`

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }

            fs.writeFileSync(`${dir}/data.json`, alberguesJSON, (err) => {
                if (err) throw err
                console.log('Data successfully saved')
            })
        } catch (err) {
            console.error(err)
        }
    }
    process.exit(0)
}

main()
