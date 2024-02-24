import express from 'express'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import figlet from 'figlet'
import cors from 'cors'
import config from './utils/config.js'
import logger from './utils/logger.js'
import routeHandler from './controllers/handleRoutes.js'
import register from './controllers/register.js'
import login from './controllers/login.js'
import { url } from './utils/subprocess.js'

let username = null
const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('login', {
        alias: 'l',
        describe: 'Login with an existing user',
        type: 'boolean',
        demandOption: false,
    })
    .option('register', {
        alias: 'r',
        describe: 'Register a new user',
        type: 'boolean',
        demandOption: false,
    })
    .help('h')
    .alias('h', 'help')
    .parse()

if (argv.register) {
    register().then((registeredUsername) => {
        username = registeredUsername
        startApp()
    })
} else {
    login().then((loggedInUsername) => {
        username = loggedInUsername
        startApp()
    })
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
    }).then(() => logger.info(`Payload for OOB Testing: ${url}`))

    const app = express()
    app.use(express.json())
    app.use(cors())

    app.use('/', routeHandler)

    const port = config.PORT || 3000
    app.listen(port, () => {
        logger.info(`Server is running on port ${port}`)
    })
}
