import express from 'express'
import config from './utils/config.js'
import logger from './utils/logger.js'
import yargs from 'yargs'
import promptSync from 'prompt-sync'
const prompt = promptSync({ sigint: true })
import { hideBin } from 'yargs/helpers'
import figlet from 'figlet'
import routeHandler from './controllers/handleRoutes.js'
import cors from 'cors'
import { User } from './models/collections.js'

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
    .alias('help', 'h').argv

// Define the user schema
if (argv.register) {
    // Ask user for username and password
    const username = prompt('Enter username: ')
    let password = prompt.hide('Enter password: ')
    let confirmPassword = prompt.hide('Confirm password: ')

    // Check if the passwords match
    while (password !== confirmPassword) {
        logger.error('Passwords do not match. Please try again.')
        password = prompt.hide('Enter password: ')
        confirmPassword = prompt.hide('Confirm password: ')
    }

    // Check if the username already exists else save
    const userExist = await User.exists({ username })
    if (userExist) {
        logger.error('Username already exists')
        process.exit(1)
    }
    const newUser = new User({ username, password })
    newUser
        .save()
        .then(() => {
            logger.info('User registered successfully')
            startApp()
        })
        .catch((error) => {
            logger.error(error.message)
            process.exit(1)
        })
} else if (argv.login) {
    // Ask user for username and password
    const username = prompt('Enter username: ')
    const password = prompt.hide('Enter password: ')

    // Find the user in the database
    const user = await User.findOne({ username })

    // Check if the user exists
    if (!user) {
        logger.error('User not found')
        process.exit(1)
    }

    // Check if the password is correct
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        logger.error('Incorrect password. Please try again.')
        process.exit(1)
    }
    logger.info('Login successful')

    // Start the app
    startApp()
} else {
    logger.info('Please login to start the app.')
    process.exit(1)
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
