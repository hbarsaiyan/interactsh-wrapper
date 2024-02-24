import express from 'express'
import config from './utils/config.js'
import logger from './utils/logger.js'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import figlet from 'figlet'
import routeHandler from './controllers/handleRoutes.js'
import cors from 'cors'
import register from './controllers/register.js'
import login from './controllers/login.js'

const argv = yargs(hideBin(process.argv))
    .options({
        register: {
            alias: 'r',
            describe: 'Register a new user',
            type: 'boolean',
        },
        login: {
            alias: 'l',
            describe: 'Login with an existing user',
            type: 'boolean',
        },
    })
    .help()
    .strictCommands()
    .alias('help', 'h').argv

let username = null

if (argv.register) {
    register().then((registeredUsername) => {
        username = registeredUsername
        startApp()
    })
} else if (argv.login) {
    login().then((loggedInUsername) => {
        username = loggedInUsername
        startApp()
    })
} else {
    logger.info('Please login to start the app.')
    process.exit(1)
}

export function getUsername() {
    return username
}

function startApp() {
    figlet('interactsh-wrapper', function (err, data) {
        if (err) {
            logger.info('Something went wrong...')
            console.dir(err)
            return
        }
        logger.info(data)
    })

    const app = express()
    app.use(express.json())
    app.use(cors())

    app.use('/', routeHandler)

    const port = config.PORT || 3000
    app.listen(port, () => {
        logger.info(`Server is running on port ${port}`)
    })
}
