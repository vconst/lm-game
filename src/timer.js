
export const initTimer = (k, state, isHost, socket, openNextLevel) => {
	if(isHost) {
		const disposeLoop = k.loop(1, () => {
			state.time--;
			socket.emit('state', state);
			if(state.time === 0) {
				openNextLevel();
			}
		});
	} else {
		socket.on('state', (newState) => {
			state = newState;
		});
	}

	k.onDraw(() => {
		const text = state.time.toFixed();
		const textSize = k.formatText({
			text,
			size: 30,
			font: "sink",
		});
		k.drawText({
			text,
			size: 30,
			font: "sink",
			pos: k.vec2(k.width() - textSize.width - 20, 20),
			fixed: true
		});

		if(state.time > 55) {
			const levelText = 'Level ' + state.level;
			const levelSize = k.formatText({
				text: levelText,
				size: 100,
				font: "sink",
			});
			k.drawText({
				text: levelText,
				size: 100,
				font: "sink",
				pos: k.vec2((k.width() - levelSize.width) / 2, (k.height() - levelSize.height) / 2),
				fixed: true
			});
		}
	});
};
