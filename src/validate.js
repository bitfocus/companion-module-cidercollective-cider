const HOST_PATTERN = /^(\[[0-9A-Fa-f:]+\]|[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*):(\d{1,5})$/

function isValidHost(host) {
    if (typeof host !== 'string') return false

    const match = HOST_PATTERN.exec(host.trim())
    if (!match) return false

    const port = Number(match[2])
    return port > 0 && port <= 65535
}

function isValidToken(token) {
    if (typeof token !== 'string') return false

    const trimmed = token.trim()
    return trimmed.length >= 10 && !/\s/.test(trimmed)
}

module.exports = { HOST_PATTERN, isValidHost, isValidToken }
