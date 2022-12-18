import socket from './socket';

import kaboom from 'kaboom';

import { initPlayer, movePlayer } from './player';
import { initTimer } from './timer';

const k = kaboom({ 
	background: [200, 200, 200],
	global: false
 });

k.loadSprite("vadim", "../img/vadim.png");

k.focus();

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
