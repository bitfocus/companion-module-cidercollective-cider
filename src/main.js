const { InstanceBase, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')
const UpdatePresetDefinitions = require('./presets')
const { HOST_PATTERN, isValidHost, isValidToken } = require('./validate')

const { io } = require('socket.io-client')

class ModuleInstance extends InstanceBase {
    constructor(internal) {
        super(internal)
    }

    async init(config) {
        this.config = config

        this.playbackState = false
        this.songTitle = ''

        this.updateStatus(InstanceStatus.Connecting)

        this.initSocketIo()

        this.updateActions()
        this.updateFeedbacks()
        this.updateVariableDefinitions()
        this.updatePresetDefinitions()

        this.setVariableValues({
            song_title: this.songTitle,
            playback_state: 'paused',
        })
    }

    setPlaybackState(isPlaying) {
        this.playbackState = isPlaying
        this.setVariableValues({ playback_state: isPlaying ? 'playing' : 'paused' })
        this.checkFeedbacks('is_playing')
    }

    initSocketIo() {
        if (this.socket !== undefined) {
            this.socket.disconnect()
            delete this.socket
        }

        const host = this.config.host;
        const token = this.config.token;

        if (!isValidHost(host) || !isValidToken(token)) {
            this.updateStatus(InstanceStatus.BadConfig, 'Host or Token missing/invalid')
            return
        }

        const url = `http://${host}`
        
        this.socket = io(url, {
            extraHeaders: {
                'apitoken': token,
                'apptoken': token
            }
        })

        this.socket.on('connect', () => {
            this.log('info', 'Socket.io to Cider opened successfully!')
            this.updateStatus(InstanceStatus.Ok)
        })

        this.socket.onAny((eventName, ...args) => {
            if (eventName === 'API:Playback') {
                try {
                    const payload = args[0]
                    
                    if (!payload) return;

                    if (payload.type === 'playbackStatus.playbackStateDidChange' && payload.data) {
                        const state = payload.data.state;
                        this.setPlaybackState(state === 'playing');
                        if (payload.data.attributes && payload.data.attributes.name) {
                            this.songTitle = payload.data.attributes.name;
                            this.setVariableValues({ song_title: this.songTitle });
                        }
                    }

                    else if (payload.type === 'playbackStatus.playbackTimeDidChange' && payload.data) {
                        const isPlaying = payload.data.isPlaying;

                        if (isPlaying !== undefined && isPlaying !== this.playbackState) {
                            this.setPlaybackState(isPlaying);
                        }
                    }
                } catch (error) {
                    this.log('error', `Error parsing Cider data: ${error.message}`);
                }
            }
        })

        this.socket.on('disconnect', (reason) => {
            this.log('warn', `Socket.io disconnected (Reason: ${reason})`)
            this.updateStatus(InstanceStatus.Disconnected)
        })

        this.socket.on('connect_error', (error) => {
            this.log('error', `Socket.io connection error: ${error.message}`)
            this.updateStatus(InstanceStatus.ConnectionFailure)
        })
    }

    async destroy() {
        if (this.socket !== undefined) {
            this.socket.disconnect()
            delete this.socket
        }
    }

    async configUpdated(config) {
        if (this.config.host !== config.host || this.config.token !== config.token) {
            this.config = config
            this.initSocketIo()
        } else {
            this.config = config
        }
    }

    getConfigFields() {
        return [
            {
                type: 'textinput',
                id: 'host',
                label: 'Target Host (Host/IP:Port)',
                width: 12,
                default: '127.0.0.1:10767',
                regex: HOST_PATTERN.toString(),
            },
            {
                type: 'textinput',
                id: 'token',
                label: 'Cider API Token',
                width: 12,
            },
        ]
    }

    updateActions() {
        UpdateActions(this)
    }

    updateFeedbacks() {
        UpdateFeedbacks(this)
    }

    updateVariableDefinitions() {
        UpdateVariableDefinitions(this)
    }

    updatePresetDefinitions() {
        UpdatePresetDefinitions(this)
    }
}

module.exports = ModuleInstance