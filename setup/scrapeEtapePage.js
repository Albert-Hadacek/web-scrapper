/* eslint-disable no-undef */
const scrapeEtapePage = async (browser, url, etape) => {
    let page = await browser.newPage()
    console.log(`Navigating to ${url}...`)
    await page.setDefaultNavigationTimeout(0)
    await page.goto(url)

    const accomUrls = await page.evaluate(() => {
        els = document.querySelectorAll('tr .views-field-title a')
        return [...els]
            .filter((el) => !el.hasAttribute('data-toggle'))
            .map((el) => el.href)
    })

    const data = await Promise.all(
        accomUrls.map(async (url) => {
            const newPage = await browser.newPage()
            await newPage.setDefaultNavigationTimeout(0)
            await newPage.goto(url)
            console.log(`Navigating to ${url}`)
            const data = await newPage.evaluate((etape) => {
                let title = document.querySelector('h1')
                if (title) {
                    title = title.textContent
                } else {
                    title = null
                }

                let city = document.querySelector(
                    '.field-name-field-localidad a'
                )
                if (city) {
                    city = city.textContent
                } else {
                    city = null
                }

                let priceShared = document.querySelector(
                    '.field-name-field-room-price span.glyphicons-user-structure'
                )
                if (priceShared) {
                    priceShared =
                        priceShared.parentElement.parentElement
                            .firstElementChild.textContent
                } else {
                    priceShared = null
                }

                let phone = document.querySelector(
                    '.field-name-field-contact-phone a'
                )
                if (phone) {
                    phone = phone.textContent
                } else {
                    phone = null
                }

                let web = document.querySelector('.field-name-field-web a')
                if (web) {
                    web = web.href
                } else {
                    web = null
                }

                let openingTime = document.querySelector(
                    '.field-name-field-hora-de-apertura-'
                )
                if (openingTime) {
                    openingTime = openingTime.lastElementChild.textContent.trim()
                    openingTime = !!Number(openingTime[0]) ? openingTime : null
                } else {
                    openingTime = null
                }

                let booking = document.querySelector(
                    '.field-name-booking-com-link a'
                )
                if (booking) {
                    booking = booking.href
                } else {
                    booking = null
                }

                let accomodation = document.querySelectorAll(
                    '.field-name-field-room-number tr'
                )
                if (accomodation) {
                    accomodation = [...accomodation]
                        .map((el) => {
                            
                            if (!el.lastElementChild.firstElementChild) {
                                return null
                            }

                            switch (
                                el.lastElementChild.firstElementChild
                                    .classList[1]
                            ) {
                                case 'glyphicons-bedroom-nightstand':
                                    return {
                                        type: 'room',
                                        amount: parseInt(
                                            el.firstElementChild.textContent
                                        ),
                                    }
                                case 'glyphicons-user-structure':
                                    return {
                                        type: 'shared',
                                        amount: parseInt(
                                            el.firstElementChild.textContent
                                        ),
                                    }

                                case 'glyphicons-home': {
                                    return {
                                        type: 'apartment',
                                        amount: parseInt(
                                            el.firstElementChild.textContent
                                        ),
                                    }
                                }

                                default:
                                    return null
                            }
                        })
                        .filter((el) => el !== null)
                } else {
                    accomodation = null
                }

                let coords = document.querySelector('.staticmap-link a')
                if (coords) {
                    const url = new URL(coords.href).search.split('%2C')
                    coords = [url[0].substring(3), url[1]]
                } else {
                    coords = null
                }

                return {
                    title,
                    phone,
                    city,
                    web,
                    coords,
                    etape,
                    accomodation,
                    booking,
                    priceShared,
                    openingTime,
                }
            }, etape)
            newPage.close()
            return data
        })
    ).catch((e) => console.error(e))
    await page.close()
    return data
}

export default scrapeEtapePage
