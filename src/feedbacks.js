const { combineRgb } = require('@companion-module/base')

module.exports = function (self) {
    self.setFeedbackDefinitions({
        is_playing: {
            name: 'Playback Status Color',
            type: 'boolean', 
            label: 'Change color depending on Play/Pause state',
            defaultStyle: {
                bgcolor: combineRgb(0, 255, 0),
                color: combineRgb(0, 0, 0),
            },
            options: [
                {
                    type: 'dropdown',
                    id: 'state',
                    label: 'Status',
                    choices: [
                        { id: 'playing', label: 'When music is playing' },
                        { id: 'paused', label: 'When music is paused' }
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