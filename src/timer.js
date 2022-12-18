
export const initTimer = (k) => {
	k.onDraw(() => {
		const time = 60 - k.time();
		if(time <= 0) {
			k.go('win');
		}
		const text = time.toFixed();
		const textSize = k.formatText({
			text,
			size: 30,
			font: "sink",
		})
		k.drawText({
			text,
			size: 30,
			font: "sink",
			pos: k.vec2(k.width() - textSize.width - 20, 20)
		})
	});
};
