export const find_page_begin_end = (currentPage: number = 1, maxPage: number = 1) => {
    const step = 5
    let beginBlock = 1
    let begin: number = 1
    let next_end = step * beginBlock

    while (currentPage > next_end) {
        beginBlock++ //next with 5 items
        next_end = step * beginBlock
    }

    begin = next_end - step + 1
    let end: number = next_end
    end = end > maxPage ? maxPage : end

    const listPages = []
    //fist
    listPages.push({ label: '«', page: 1, class: 'btn-light-primary' })
    //previous
    listPages.push({
        label: '‹',
        page: currentPage - 1 <= 0 ? 1 : currentPage - 1,
        class: 'btn-light-primary',
    })
    //list page with 5 items
    for (let index = begin; index <= end; index++) {
        listPages.push({ label: index, page: index, class: currentPage === index ? 'active' : '' })
    }
    //next
    listPages.push({
        label: '›',
        page: currentPage + 1 > maxPage ? maxPage : currentPage + 1,
        class: 'btn-light-primary',
    })
    //last
    listPages.push({ label: '»', page: maxPage, class: 'btn-light-primary' })

    return listPages
};

interface iCurrency {
    [key: string]: String
}

export const formatMoney = (amount: string | number) => {
    const localization: any = process.env.REACT_APP_LOCALIZATION;

    const currencySymbols: iCurrency = {
        "VN": '₫',
        "TH": '฿',
        "PH": '₱',
        "ID": 'Rp',
        "MALAY": "RM",
        "SG": "$",
        "TW": "NT$",
        "HK": "HK$"
    }
    
    if (!amount)
        return `${amount}${currencySymbols[localization]}`
    if (['HK','VN'].includes(localization))
        return `${amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') || ''}${currencySymbols[localization]}`

    return `${currencySymbols[localization]}${amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') || ''}`
};
