import { Interaction } from '../models/collections.js'
import { getUsername } from '../index.js'
import { url } from './subprocess.js'
import logger from './logger.js'

const parseInteractionsFromData = (data) => {
    const logLines = data.toString().split('\n')
    const interactions = []
    const username = getUsername()

    logLines.forEach((line) => {
        const match = line.match(
            /\[(.*?)\] Received HTTP .* from (\d+\.\d+\.\d+\.\d+) at (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/
        )
        if (match) {
            const interaction = new Interaction({
                username,
                payload: url,
                callerIp: match[2],
                timestamp: match[3],
            })
            interaction
                .save()
                .then(() => logger.info('Data saved successfully'))
                .catch((error) =>
                    logger.info('Error saving data:', error.message)
                )

            // const payload = match[0]
            // const callerIp = match[1]
            // const timestamp = match[2]
            // interactions.push({ payload, callerIp, timestamp })
        }
    })

    return interactions
}

const parseUrlFromData = (data) => {
    data = data.toString()
    const regex =
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.oast\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
    const url = data.match(regex)
    return url ? 'https://' + url[0] : null
}

export { parseInteractionsFromData, parseUrlFromData }
