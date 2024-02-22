const parseInteractionsFromData = (data) => {
    const logLines = data.toString().split('\n')
    const interactions = []

    logLines.forEach((line) => {
        const match = line.match(
            /\[.*\] Received (.*) from .* at (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/
        )
        if (match) {
            const interaction = match[0]
            const timestamp = match[2]
            interactions.push({ timestamp, interaction })
        }
    })

    return interactions
}

const parseUrlFromData = (data) => {
    const chunk = data.toString()
    const chunks = chunk.split(' ')
    const url = chunks[chunks.length - 1].slice(0, -1)
    return url
}

export { parseInteractionsFromData, parseUrlFromData }
