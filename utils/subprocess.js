import { spawn } from 'child_process'
import { parseUrlFromData, parseInteractionsFromData } from './middleware.js'
import logger from './logger.js'

const subProcess = spawn('interactsh-client')

let url = ''

function listener(command) {
    subProcess.stdout.setEncoding('utf8')
    subProcess.stdout.on('data', (data) => {
        parseInteractionsFromData(data)
    })

    subProcess.stderr.setEncoding('utf8')
    subProcess.stderr.on('data', (data) => {
        url = parseUrlFromData(data)
    })

    subProcess.on('error', (error) => {
        logger.error(`Error spawning interactsh-client: ${error.message}`)
        process.exit(1)
    })
}

export { url, listener }
