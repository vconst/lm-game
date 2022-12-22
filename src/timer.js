
export const initTimer = (k, state, isHost, socket) => {
	const end = k.time() + 60;

	if(isHost) {
		const disposeLoop = k.loop(1, () => {
			state.time--;
			socket.emit('state', state);
			if(state.time === 0) {
				disposeLoop();
				socket.emit('win');
				k.go('win');
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
	});
};
