const parseInteractionsFromData = (data) => {
    const logLines = data.toString().split('\n')
    const interactions = []

    logLines.forEach((line) => {
        const match = line.match(
            /\[.*\] Received .* from (\d+\.\d+\.\d+\.\d+) at (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/
        )
        if (match) {
            const timestamp = match[2]
            const callerIp = match[1]
            interactions.push({ timestamp, callerIp })
        }
    })

    return interactions
}

const parseUrlFromData = (data) => {
    data = data.toString()
    const regex =
        /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
    const url = data.match(regex)
    return url ? url[0] : null
}

export { parseInteractionsFromData, parseUrlFromData }
