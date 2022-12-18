
export const initTimer = (k) => {
	k.onDraw(() => {
		const text = (60 - k.time()).toFixed();
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
