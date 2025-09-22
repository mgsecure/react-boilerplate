import fetch from 'node-fetch'
import { discordWebhookURL } from '../keys/discordKeys.js'

export default async function sendToDiscord(req, res) {
    console.log('sendToDiscord', req.body)

    // Build raw username text from inputs
    const rawUsername = req.body.platform
        ? (req.body.platform === 'Other' && req.body.otherPlatform)
            ? `${req.body.username || 'Anonymous'} (${req.body.otherPlatform})`
            : `${req.body.username || 'Anonymous'} (${req.body.platform})`
        : (req.body.username || 'Anonymous')

    // Normalize username to satisfy Discord webhook constraints (1-80 chars, no newlines/control chars)
    let usernameText = String(rawUsername ?? '')
        .replace(/[\r\n\t]/g, ' ')         // remove control chars
        .replace(/\s+/g, ' ')                // collapse whitespace
        .replace(/Discord|discord/g, 'Discor.d')  // prevent mass-mentioning
        .replace('@', '@-')
        .trim()

    if (!usernameText) usernameText = 'Anonymous'

    // Prevent mass-mentioning and cut to 80 chars max
    usernameText = usernameText
        .slice(0, 80)

    console.log('usernameText', usernameText)

    if (!req.body.message || typeof req.body.message !== 'string' || !req.body.message.trim()) {
        console.log('No message provided, not sending to Discord.')
        return res.status(400).json({ error: 'invalid_body', message: 'message is required' })
    }

    // Get webhook URL from env (avoid hardcoding secrets)
    let webhookURL
    try {
        //const raw = assertEnv('DISCORD_WEBHOOK_URL')
        webhookURL = String(discordWebhookURL).trim()
        // validate URL shape
        new URL(webhookURL)
    } catch (e) { //eslint-disable-line no-unused-vars
        console.error('Invalid or missing DISCORD_WEBHOOK_URL')
        return res.status(500).json({ error: 'server_misconfigured', message: 'DISCORD_WEBHOOK_URL not set or invalid' })
    }

    const payload = {
        username: usernameText,
        content: req.body.message.trim()
    }

    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'react-boilerplate-bot/1.0 (+https://github.com/)'
            },
            body: JSON.stringify(payload)
        })

        const text = await response.text()
        if (!response.ok) {
            // Forward upstream status for better diagnostics (capped to known client/server classes)
            const status = [400,401,403,404,429].includes(response.status) ? response.status : 502
            console.warn('Discord webhook non-OK', { status: response.status, body: text })
            return res.status(status).json({ error: 'discord_webhook_failed', status: response.status, message: text?.slice(0, 500) || 'Upstream error' })
        }
        console.log('Webhook sent successfully!')
        return res.json({ ok: true })
    } catch (error) {
        console.error('Error sending webhook:', error)
        return res.status(502).json({ error: 'discord_webhook_failed', message: String(error.message || error) })
    }
}