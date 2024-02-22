import express from 'express'
import config from './utils/config.js'
import figlet from 'figlet'
import routeHandler from './controllers/handleRoutes.js'
import cors from 'cors'

figlet('interactsh-wrapper', function (err, data) {
    if (err) {
        console.log('Something went wrong...')
        console.dir(err)
        return
    }
    console.log(data)
})

const app = express()
app.use(express.json())
app.use(cors())

app.use('/', routeHandler)

const port = config.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
