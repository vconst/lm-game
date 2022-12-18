import socket from './socket';

import kaboom from 'kaboom';

import { createPlayer, initPlayer, movePlayer } from './player';
import { initTimer } from './timer';

const k = kaboom({ 
	background: [200, 200, 200],
	global: false
 });

k.loadSprite("vadim", "../img/vadim.png");
k.loadSprite("alex", "../img/alex.png");

k.focus();

k.scene('lobby', () => {
	['vadim', 'alex'].forEach((name, index, names) => {
		const player = createPlayer(k, name, [k.width() / (names.length + 1) * (index + 1), k.height() / 3]);
		player.onClick(() => {
			k.go('game', name);
		});
		return player;
	});
});

k.scene('game', (playerName) => {
	initTimer(k);

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

k.go('lobby');
