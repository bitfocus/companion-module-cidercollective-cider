const { isValidHost, isValidToken } = require('./validate')

module.exports = function (self) {
    const sendCommand = async (endpoint) => {
        const host = self.config.host
        const token = self.config.token

        if (!isValidHost(host) || !isValidToken(token)) {
            self.log('warn', 'Action cancelled: Host or Token missing/invalid')
            return
        }

        const url = `http://${host}/api/v1/playback/${endpoint}`

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
        transport: {
            name: 'Playback Control',
            options: [
                {
                    type: 'dropdown',
                    id: 'action',
                    label: 'Action',
                    default: 'playpause',
                    choices: [
                        { id: 'play', label: 'Play' },
                        { id: 'pause', label: 'Pause' },
                        { id: 'playpause', label: 'Play / Pause (Toggle)' },
                        { id: 'stop', label: 'Stop' },
                        { id: 'next', label: 'Next Track' },
                        { id: 'previous', label: 'Previous Track' },
                    ]
                }
            ],
            callback: async (event) => {
                await sendCommand(event.options.action)
            },
        }
    })
}