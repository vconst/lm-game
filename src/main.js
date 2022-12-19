import socket from './socket';

import kaboom from 'kaboom';

import { createPlayer, initPlayer, movePlayer } from './player';
import { initFeatures } from './feature';
import { initTimer } from './timer';

const k = kaboom({ 
	background: [200, 200, 200],
	global: false
 });

k.loadSprite("vadim", "img/vadim.png");
k.loadSprite("alex", "img/alex.png");
k.loadSprite("kostya", "img/kostya.png");
k.loadSprite("feature", "img/feature.png");
k.loadSprite("service", "img/service.png");

k.focus();

k.scene('lobby', () => {
	['vadim', 'alex', 'kostya'].forEach((name, index, names) => {
		const player = createPlayer(k, name, [k.width() / (names.length + 1) * (index + 1), k.height() / 3]);
		player.onClick(() => {
			k.go('game', name);
		});
		return player;
	});
});

k.scene('game', (playerName) => {
	initTimer(k);

	initFeatures(k);

	const player = initPlayer(k, playerName, socket);
	
	const keysMapping = {
		w: 'up',
		s: 'down',
		d: 'right',
		a: 'left',
	};
	
	const keys = {};
	
	['up', 'down', 'right', 'left', 'w', 's', 'd', 'a'].forEach(key => {
		const realKey = keysMapping[key] || key;
		k.onKeyPress(key, () => keys[realKey] = true);
		k.onKeyRelease(key, () => keys[realKey] = false);
	});
	
	k.onUpdate(() => {
		movePlayer(k, player, keys, socket);
	});
});

k.scene('win', () => {
	k.onDraw(() => {
		const text = 'You win!!!';
		const textSize = k.formatText({
			text,
			size: 100,
		})
		k.drawText({
			text,
			size: 100,
			pos: k.vec2((k.width() - textSize.width) / 2, (k.height() - textSize.height) / 2)
		})
	});

	k.onMouseDown(() => {
		k.go('lobby');
	})
});

k.go('lobby');
