// server/src/routes/discord.bundle.js
import { Router } from 'express'
const router = Router()

// GET /api/discord  (optional informational route)
router.get('/', (req, res) => {
    req.log.info('discord route hit')
    res.json({ message: 'LPU Discord endpoint', requestId: req.id })
})

router.post('/', async (req, res, next) => {
    try {
        const { default: sendToDiscord } = await import('./sendToDiscord.js')
        await sendToDiscord(req, res)
    } catch (e) { next(e) }
})

export default router
