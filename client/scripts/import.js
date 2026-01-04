import fs from 'fs'
import dayjs from 'dayjs'
import {parse} from 'csv-parse/sync'
import {
    roasterSchema,
} from './importSchemas.js'
import fetch from 'node-fetch'
import validate from './importValidate.js'
import {DATA_SHEET_ID} from '../../keys/importKeys.js'

// Helper to load and validate a file
const importValidate = async (tab, schema) => {
    console.log(`Importing ${tab}...`)

    // Download file
    const safeTab = encodeURI(tab)

    const url = `https://docs.google.com/spreadsheets/d/${DATA_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${safeTab}&headers=1`
    const csvData = await (await fetch(url)).text()

    // Parse CSV into JSON
    const data = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    })

    // Validate data before merging in
    validate(data, schema)

    return data
}

// Load all 3 data files (LOL)
const roasterData = await importValidate('Roasters', roasterSchema)

// Load previous JSON for recently updated checks
//const originalData = JSON.parse(fs.readFileSync('./src/data/data.json', 'utf8'))

// Transform fields into internal JSON format
console.log('Processing main data...')
const jsonData = roasterData
    .map(datum => {
        const id = datum['ID']
        const name = datum.Roaster
        const city = datum.City
        const stateRegion = datum['State/Region']
        const country = datum.Country
        const link = datum.Link
        const pouroverVotes = datum['Pourover Votes']
        const roastfulRanking = datum['Roastful Ranking']
        const source = splitCommaValues(datum.Source)

        const value = {
            id,
            name,
            city,
            stateRegion,
            country,
            link,
            pouroverVotes,
            roastfulRanking,
            source
        }

        // Clean up empty values to reduce payload size
        Object.keys(value).forEach(key => {
            if (typeof value[key] === 'string' && value[key] === '') value[key] = undefined
            else if (Array.isArray(value[key]) && value[key].length === 0) value[key] = undefined
        })

        return value
    })
    .sort((a, b) => {
        return a.name.localeCompare(b.name)
    })

/*
// Find any added or deleted entries
const historicalData = JSON.parse(fs.readFileSync('./src/data/historicalData.json', 'utf8'))
let changedEntries = 0
jsonData.forEach(entry => {
    const previousEntry = originalData.find(e => e.id === entry.id)
    if (!previousEntry && !historicalData[entry.id]) {
        historicalData[entry.id] = {...entry, name, dateAdded: dayjs().toISOString()}
        changedEntries++
    } else if (historicalData[entry.id]) {
        delete historicalData[entry.id].dateDeleted
        historicalData[entry.id] = {...historicalData[entry.id], ...entry, name}
    }
    entry.dateAdded = historicalData[entry.id].dateAdded
})
originalData.forEach(entry => {
    const currentEntry = jsonData.find(e => e.id === entry.id)
    if (!currentEntry) {
        historicalData[entry.id] = {...historicalData[entry.id], dateDeleted: dayjs().toISOString()}
        changedEntries++
    }
})

// Save historical data & deleted entries
console.log('Writing historicalData.json')
console.log(`${changedEntries} additions or deletions found`)
fs.writeFileSync('./src/data/historicalData.json', JSON.stringify(historicalData, null, 2))

console.log('Writing deletedEntries.json')
const deletedEntries = Object.values(historicalData).filter(entry => entry.dateDeleted) || []
fs.writeFileSync('./src/data/deletedEntries.json', JSON.stringify(deletedEntries, null, 2))
*/

// Write out to src location for usage
console.log('Writing roasters.json...')
fs.writeFileSync('../src/data/roasters.json', JSON.stringify(jsonData, null, 2))

console.log('Complete.')

function splitCommaValues(string) {
    if (!string) return []
    return string.replace(/\s+,|,\s+/g, ',')
        .split(',')
        .map(s => s.trim())
        .filter(x => x)
}
