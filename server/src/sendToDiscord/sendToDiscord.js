export default async function sendToDiscord(req, res) {
    const log = req.log ?? console
    const isDev = process.env.NODE_ENV !== 'production'

    const match = req.ip ? req.ip.match(/\d+\.\d+\.(\d+\.\d+)$/) : undefined
    let ipString = match ? ` (${match[1]})` : ''

    let msg = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
    if (!msg) return res.status(400).json({error: 'invalid_body', message: 'message is required'})
    msg = String(msg) + ipString

    const platform = req.body?.platform
    const other = req.body?.otherPlatform
    const rawName = platform
        ? (platform === 'Other' && other)
            ? `${req.body?.username || 'Anonymous'} (${other})`
            : `${req.body?.username || 'Anonymous'} (${platform})`
        : (req.body?.username || 'Anonymous')

    let username = String(rawName || '')
        .replace(/[\r\n\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/Discord/gi, 'Discor.d') // "discord" isn't allowed in usernames
        .replace('@', '@-')
        .slice(0, 80)
        .trim() || 'Anonymous'

    let webhookURL
    try {
        const {mgsecureWebhookURL, lpuWebhookURL} = await import('../keys/discordKeys.js')
        webhookURL = (isDev || req.body?.username === 'test') ? String(mgsecureWebhookURL).trim() : String(lpuWebhookURL).trim()
        new URL(webhookURL)
    } catch {
        log.error('Invalid or missing DISCORD_WEBHOOK_URL')
        return res.status(500).json({error: 'server_misconfigured'})
    }

    const payload = {username, content: msg}

    try {
        const r = await fetch(webhookURL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'User-Agent': 'lp-united/1.0'},
            body: JSON.stringify(payload)
        })

        const text = await r.text()
        if (!r.ok) {
            const status = [400, 401, 403, 404, 429].includes(r.status) ? r.status : 502
            log.warn({status: r.status, bodyLen: text.length}, 'discord webhook non-OK')
            return res.status(status).json({
                error: 'discord_webhook_failed',
                status: r.status,
                message: text.slice(0, 500) || 'Upstream error'
            })
        }

        req.log.info('discord message sent')
        return res.json({ok: true})
    } catch (err) {
        log.error({err}, 'discord webhook error')
        return res.status(502).json({error: 'discord_webhook_failed', message: String(err?.message || err)})
    }
}
