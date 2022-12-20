
export const initTimer = (k, isHost) => {
	const end = k.time() + 60;
	
	k.onDraw(() => {
		const time = end - k.time();
		
		if(time < 1) {
			k.go('win');
		}
		const text = time.toFixed();
		const textSize = k.formatText({
			text,
			size: 30,
			font: "sink",
		});
		k.drawText({
			text,
			size: 30,
			font: "sink",
			pos: k.vec2(k.width() - textSize.width - 20, 20)
		});
	});
};
