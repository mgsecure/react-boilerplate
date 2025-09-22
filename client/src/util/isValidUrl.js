export default function isValidUrl(string) {
    let url
    try {
        url = new URL(string)
    } catch (_) { //eslint-disable-line no-unused-vars
        return false
    }
    return url.protocol === 'http:' || url.protocol === 'https:'
}


