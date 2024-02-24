import { Interaction } from '../models/collections.js'
import { getUsername } from '../index.js'
import { url } from './subprocess.js'
import logger from './logger.js'

const parseInteractionsFromData = (data) => {
    const logLines = data.toString().split('\n')
    const username = getUsername()

    logLines.forEach((line) => {
        const match = line.match(
            /\[(.*?)\] Received HTTP .* from (\d+\.\d+\.\d+\.\d+) at (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/
        )
        if (match) {
            logger.info(match[0])
            const interaction = new Interaction({
                username,
                payload: url,
                callerIp: match[2],
                timestamp: match[3],
            })
            interaction
                .save()
                .catch((error) =>
                    logger.info('Error saving data:', error.message)
                )
        }
    })
}

const parseUrlFromData = (data) => {
    data = data.toString()
    const regex =
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.oast\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
    const url = data.match(regex)
    return url ? 'https://' + url[0] : null
}

export { parseInteractionsFromData, parseUrlFromData }
