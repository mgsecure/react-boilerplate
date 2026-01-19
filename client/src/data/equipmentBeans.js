export const machineTypes = ['Grinder', 'Espresso', 'Pour-over', 'French Press', 'Stovetop', 'Drip', 'Other']

export const typeSort = (a, b) => {
    return machineTypes.indexOf(a) - machineTypes.indexOf(b)
}

export const flags = ['star', 'up', 'down', 'none']
export const flagSort = (a, b) => {
    return flags.indexOf(a) - flags.indexOf(b)
}

export const beanFields = ['roaster', 'name', 'origin', 'caffeine', 'roastLevel',
    'roastDate', 'roasterCity', 'roasterCountry', 'weight', 'priceUnit', 'price',
    'price100g', 'pricePound', 'roasterNotes', 'tastingNotes', 'rating', 'url']

export const roastLevels = ['Light', 'Light/Medium', 'Medium', 'Medium/Dark', 'Dark']

export const currencies = [
    'EUR (€)',
    'USD ($)',
    'divider',
    'ARS ($)',
    'AUD (A$)',
    'CAD (C$)',
    'CHF (CHF)',
    'GBP (£)',
    'IDR (Rp)',
    'INR (₹)',
    'JPY (¥)',
    'NOK (kr)',
    'NZD (NZ$)',
    'SEK (kr)',
    'SGD (S$)'
]