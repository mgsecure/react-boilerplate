
export const openInNewTab = (url) => {
    const randomStuff = (Math.random()).toString(36).substring(2, 10)
    const destination = url.replace(/https*:\/\//,'')
    document.getElementById('trackImage').src = `/i/lptv.gif?trk=openURL&page=${destination}&r=${randomStuff}&w=${screen.width}&ref=${document.location}`
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}
