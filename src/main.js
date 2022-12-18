import socket from './socket';

import kaboom from 'kaboom';

import { initPlayer, movePlayer } from './player';
import { initBackground, initTimer } from './background';

const k = kaboom({ global: false });

k.focus();

initBackground(k);

initTimer(k);

const player = initPlayer(k, socket);

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
