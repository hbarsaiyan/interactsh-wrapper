import express from 'express'
import config from './utils/config.js'
import routeHandler from './controllers/handleRoutes.js'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

app.use('/', routeHandler)

const port = config.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
