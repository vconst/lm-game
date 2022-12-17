export const initBackground = (k) => {
	const background = k.add([
		k.scale(1),
		k.fixed()
	]);
	
	background.onDraw(() => {
		k.drawRect({
			width: k.width(),
			height: k.height(),
			fill: true,
			color: k.Color.fromArray([200, 200, 200]),
		})
	});
};

export const initTimer = (k) => {
	k.onDraw(() => {
		k.drawText({
			text: (60 - k.time()).toFixed(),
			size: 30,
			font: "sink",
			pos: k.vec2(k.width() - 70, 20)
		})
	});
};
