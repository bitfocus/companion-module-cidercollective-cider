module.exports = function (self) {
    self.setFeedbackDefinitions({
        is_playing: {
            name: 'Playback State',
            type: 'boolean', 
            label: 'Target matches playback state',
            defaultStyle: {
                bgcolor: 0x00FF00,
                color: 0,
            },
            options: [
                {
                    type: 'dropdown',
                    id: 'state',
                    label: 'Status',
                    choices: [
                        { id: 'playing', label: 'Playing' },
                        { id: 'paused', label: 'Paused' }
                    ],
                    default: 'playing'
                }
            ],
            callback: (feedback) => {
                if (feedback.options.state === 'playing') {
                    return self.playbackState === true
                } else {
                    return self.playbackState === false
                }
            }
        }
    })
}