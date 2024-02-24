import express from 'express'
import { Interaction } from '../models/collections.js'
import { interactionPipeline, url, listener } from '../utils/subprocess.js'

const router = express.Router()

listener('interactsh-client')

// GET /api/getURL
router.get('/api/getURL', (req, res) => {
    console.log(url)
    res.json({ url })
})

// POST /api/getInteractions

router.post('/api/getInteractions', async (req, res) => {
    const { start, end } = req.body
    try {
        const filteredInteractions = await Interaction.find({
            timestamp: {
                $gte: new Date(start),
                $lte: new Date(end),
            },
        })
        res.json(filteredInteractions)
        console.log(filteredInteractions)
    } catch (error) {
        console.log('Error fetching data:', error)
        res.status(500).json({ message: 'Error fetching data' })
    }
})

export default router
