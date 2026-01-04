export const machineTypes = ['Grinder', 'Espresso', 'Pourover', 'Stovetop', 'Drip', 'Other']

export const typeSort = (a, b) => {
    return machineTypes.indexOf(a) - machineTypes.indexOf(b)
}

export const beanFields = ['roaster', 'name', 'origin', 'caffeine', 'roastLevel',
    'roastDate', 'roasterCity', 'roasterCountry', 'weight', 'priceUnit', 'price',
    'price100g', 'pricePound', 'roasterNotes', 'tastingNotes', 'rating', 'url']

export const roastLevels = ['Light', 'Light/Medium', 'Medium', 'Medium/Dark', 'Dark']

export const currencies = ['ARS ($)', 'AUD (A$)', 'CAD (C$)', 'CHF (CHF)', 'EUR (€)', 'GBP (£)', 'IDR (Rp)', 'INR (₹)', 'JPY (¥)', 'NOK (kr)', 'NZD (NZ$)', 'SEK (kr)', 'SGD (S$)', 'USD ($)']