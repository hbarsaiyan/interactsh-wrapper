import { User } from '../models/collections.js'
import prompt from 'prompt-sync'
import logger from '../utils/logger.js'

const register = async () => {
    const username = prompt('Enter username: ')
    let password = prompt.hide('Enter password: ')
    let confirmPassword = prompt.hide('Confirm password: ')

    while (password !== confirmPassword) {
        logger.error('Passwords do not match. Please try again.')
        password = prompt.hide('Enter password: ')
        confirmPassword = prompt.hide('Confirm password: ')
    }

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
        })
        .catch((error) => {
            logger.error(error.message)
            process.exit(1)
        })
}

export default register
