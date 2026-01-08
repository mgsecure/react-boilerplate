export default function entryName({entry, entryType}) {

    if (entryType === 'grinder' || entryType === 'machine') return (entry.brand && entry.model)
        ? `${entry.brand} ${entry.model}`
        : `${entry.brand || ''}${entry.model || ''}` || 'Unknown'

    else if (entryType === 'bean') return entry.roaster ? `${entry.name} (${entry.roaster})` : entry.name || 'Unknown Coffee'
    else if (entryType === 'brew') return entry.fullName || 'Unknown'
    else return entry.name || 'Unknown'

}