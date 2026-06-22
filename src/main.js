const { InstanceBase, Regex, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./upgrades')
const UpdateActions = require('./actions')
const UpdateFeedbacks = require('./feedbacks')
const UpdateVariableDefinitions = require('./variables')

const { io } = require('socket.io-client')

class ModuleInstance extends InstanceBase {
    constructor(internal) {
        super(internal)
    }

    async init(config) {
        this.config = config

        this.playbackState = false

        this.updateStatus(InstanceStatus.Connecting)

        this.initSocketIo()

        this.updateActions() 
        this.updateFeedbacks() 
        this.updateVariableDefinitions() 
    }

    initSocketIo() {
        if (this.socket !== undefined) {
            this.socket.disconnect()
            delete this.socket
        }

        const ip = this.config.host;
        const port = this.config.port;
        const token = this.config.token;

        if (!ip || !token) {
            this.updateStatus(InstanceStatus.BadConfig, 'IP or Token missing')
            return
        }

        const url = `http://${ip}:${port}`
        
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
                        this.playbackState = (state === 'playing');
                        this.checkFeedbacks('is_playing');
                    }
                    
                    else if (payload.type === 'playbackStatus.playbackTimeDidChange' && payload.data) {
                        const isPlaying = payload.data.isPlaying;
                        
                        if (isPlaying !== undefined && isPlaying !== this.playbackState) {
                            this.playbackState = isPlaying;
                            this.checkFeedbacks('is_playing');
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
        }
    }

    async configUpdated(config) {
        this.config = config
        this.initSocketIo()
    }

    getConfigFields() {
        return [
            {
                type: 'textinput',
                id: 'host',
                label: 'Target IP',
                width: 8,
                regex: Regex.IP,
                default: '127.0.0.1',
            },
            {
                type: 'textinput',
                id: 'port',
                label: 'Target Port',
                width: 4,
                regex: Regex.PORT,
                default: '10767',
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
}

module.exports = ModuleInstance