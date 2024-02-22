import { spawn } from 'child_process'
import { parseUrlFromData, parseInteractionsFromData } from './middleware.js'

const subProcess = spawn('interactsh-client')

let url = ''
const interactionPipeline = []

subProcess.stdout.on('data', (data) => {
    const interactions = parseInteractionsFromData(data)
    interactionPipeline.push(...interactions)
})

subProcess.stderr.on('data', (data) => {
    url = parseUrlFromData(data)
})

subProcess.on('error', (error) => {
    console.error(`Error spawning interactsh-client: ${error.message}`)
})

export { interactionPipeline, url }
