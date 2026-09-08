module.exports = function (self) {
	const presets = {
		toggle_playback: {
			type: 'simple',
			name: 'Play / Pause Toggle',
			style: {
				text: 'Play / Pause',
				size: 'auto',
				color: 0xffffff,
				bgcolor: 0x000000,
			},
			steps: [
				{
					down: [
						{
							actionId: 'transport',
							options: {
								action: 'playpause',
							},
							delay: 0,
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'is_playing',
					options: {
						state: 'playing',
					},
					style: {
						bgcolor: 0x00ff00,
						color: 0x000000,
					},
					isInverted: false,
				},
			],
		},
	}

	const structure = [
		{
			id: 'playback',
			name: 'Playback',
			definitions: ['toggle_playback'],
		},
	]

	self.setPresetDefinitions(structure, presets)
}
