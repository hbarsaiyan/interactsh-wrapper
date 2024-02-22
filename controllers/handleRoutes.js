import express from 'express'
import { interactionPipeline, url } from '../utils/subprocess.js'

const router = express.Router()

const filterInteractions = (start, end) => {
    return interactionPipeline.filter((interaction) => {
        const timestamp = interaction.timestamp
        return (!start || timestamp >= start) && (!end || timestamp <= end)
    })
}

// GET /api/getURL
router.get('/api/getURL', (req, res) => {
    console.log(url)
    res.json({ url })
})

// POST /api/getInteractions
router.post('/api/getInteractions', (req, res) => {
    const { start, end } = req.body
    const filteredInteractions = filterInteractions(start, end)
    res.json(filteredInteractions)
    console.log(filteredInteractions)
})

export default router
