export default function cleanObject(object) {
    if (!object || typeof object !== 'object' || Array.isArray(object)) {
        return object || {}
    }

    return Object.fromEntries(
        Object.entries(object)
            .filter(([_key, value]) => value !== null && typeof value !== 'undefined') //eslint-disable-line
            .map(([key, value]) => {
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    return [key, cleanObject(value)]
                }
                return [key, value]
            })
    )
}