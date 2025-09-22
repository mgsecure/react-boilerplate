import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import EventEmitter from 'events'
import dayjs from 'dayjs'
import {prodUser} from './keys/users.js'

dotenv.config()

const app = express()
app.disable('etag')
app.disable('x-powered-by')
app.use(helmet())
app.use(express.json({limit: '200kb'}))
const largeJson = express.json({limit: '2mb'})

const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()).filter(Boolean)
    : true
app.use(cors({origin: corsOrigin, credentials: true}))

const prod = false
const envText = prod ? '' : ' (DEV)'
const productionServer = process.env.USER === prodUser

const apiPort = productionServer ? 9082 : 4000
const apiPrefix = productionServer ? '/' : '/api'

const myEmitter = new EventEmitter()
myEmitter.on('myEvent', (data) => {
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss ZZ')
    console.log(timestamp, '-', data)
})

// Liveness and readiness
app.get(`${apiPrefix}/health`, (_req, res) => {
    myEmitter.emit('myEvent', 'Health Check' + envText)
    res.json({ok: true})
})

app.get(`${apiPrefix}/ready`, (_req, res) => {
    myEmitter.emit('myEvent', 'Ready Check' + envText)
    res.json({ready: true})
})

// Example echo route with zod validation
app.post(`${apiPrefix}/echo`, largeJson, async (req, res) => {
    myEmitter.emit('myEvent', 'Echo Message' + envText)
    req.body ||= {}
    req.body.prod = prod
    const { default: echoMessage } = await import('./echo/echoMessage.js')
    await echoMessage(req, res)
})

app.post(`${apiPrefix}/discord`, async (req, res) => {
    myEmitter.emit('myEvent', 'Send To Discord' + envText)
    req.body ||= {}
    req.body.prod = prod
    const { default: sendToDiscord } = await import('./discordWebhook/sendToDiscord.js')
    await sendToDiscord(req, res)
})

const port = apiPort
const host = process.env.HOST || '127.0.0.1'
app.listen(port, host, () => {
    const env = process.env.NODE_ENV || 'development'
    console.log('API listening', {env, port, host, corsOrigin})
})
