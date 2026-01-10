export default function entryName({entry={}, entryType='machine'}) {

    if (entryType === 'grinder' || entryType === 'machine') return (entry.brand && entry.model)
        ? `${entry.brand} ${entry.model}`
        : `${entry.brand || ''}${entry.model || ''}` || ''

    else if (entryType === 'coffee') return entry.roaster
        ? `${entry.name} (${entry.roaster.name})`
        : entry.name || ''

    else if (entryType === 'brew') return entry.fullName || ''

    else return entry.name || ''

}