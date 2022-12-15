import './socket';

import kaboom from 'kaboom';

const k = kaboom({ global: false });

k.focus();


k.loadBean()

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


k.onDraw(() => {
	k.drawText({
		text: (60 - k.time()).toFixed(),
		size: 30,
		font: "sink",
		pos: k.vec2(k.width() - 70, 20)
	})
})

const player = k.add([
	k.sprite("bean"),
	k.pos(100, 100),
])

const movePlayer = (direction) => {
	const speed = 200;
	if(direction === 'up') {
		player.move(0, -speed);
	}
	if(direction === 'down') {
		player.move(0, speed);
	}
	if(direction === 'left') {
		player.move(-speed, 0);
	}
	if(direction === 'right') {
		player.move(speed, 0);
	}
}

k.onKeyDown('w', () => movePlayer('up'));
k.onKeyDown('up', () => movePlayer('up'));
k.onKeyDown('s', () => movePlayer('down'));
k.onKeyDown('down', () => movePlayer('down'));
k.onKeyDown('d', () => movePlayer('right'));
k.onKeyDown('right', () => movePlayer('right'));
k.onKeyDown('a', () => movePlayer('left'));
k.onKeyDown('left', () => movePlayer('left'));
