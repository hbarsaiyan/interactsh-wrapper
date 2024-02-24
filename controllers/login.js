import { User } from '../models/collections.js'
import promptSync from 'prompt-sync'
const prompt = promptSync({ sigint: true })
import logger from '../utils/logger.js'

const login = async () => {
    const username = prompt('Enter username: ')
    const password = prompt.hide('Enter password: ')

    const user = await User.findOne({ username })

    if (!user) {
        logger.error('User not found')
        process.exit(1)
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        logger.error('Incorrect password. Please try again.')
        process.exit(1)
    }
    logger.info('Login successful')
    return username
}

export default login
