module.exports = function (self) {
    const sendCommand = async (endpoint) => {
        const ip = self.config.host
        const port = self.config.port
        const token = self.config.token

        if (!ip || !token) {
            self.log('warn', 'Action cancelled: IP or Token missing')
            return
        }

        const url = `http://${ip}:${port}/api/v1/playback/${endpoint}`

        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'apitoken': token,
                    'apptoken': token,
                    'accept': 'application/json'
                }
            })

            if (response.status === 405) {
                response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'apitoken': token,
                        'apptoken': token
                    }
                })
            }

            if (!response.ok) {
                self.log('error', `Cider API Error: ${response.status}`)
            }

        } catch (error) {
            self.log('error', `Command error: ${error.message}`)
        }
    }

    self.setActionDefinitions({
        stop: {
            name: 'Stop Music',
            options: [],
            callback: async () => {
                await sendCommand('stop')
            },
        },
        play_pause: {
            name: 'Play / Pause (Toggle)',
            options: [],
            callback: async () => {
                await sendCommand('playpause')
            },
        },
        play: {
            name: 'Play',
            options: [],
            callback: async () => {
                await sendCommand('play')
            },
        },
        pause: {
            name: 'Pause',
            options: [],
            callback: async () => {
                await sendCommand('pause')
            },
        },
        next: {
            name: 'Next Track',
            options: [],
            callback: async () => {
                await sendCommand('next')
            },
        },
        previous: {
            name: 'Previous Track',
            options: [],
            callback: async () => {
                await sendCommand('previous')
            },
        }
    })
}