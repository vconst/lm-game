import socket from './socket';

import kaboom from 'kaboom';

import { createPlayer, initPlayer, movePlayer, players } from './player';
import { generateFeatureState, initFeatures } from './feature';
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

	let state;

	socket.on('state', (newState) => {
		state = newState;
    });

	setTimeout(() => {
		const isHost = !state;
		if(state) {
			console.log('host is', state.host);
		} else {
			console.log('I am host');
			state = {
				host: player.name,
				time: 60,
				features: Array.from({ length: 10 }).map(() => {
					return generateFeatureState(k);
				})
			}
			socket.emit('state', state);
		}
		initTimer(k, state, isHost, socket);
		initFeatures(k, state, isHost, socket);
	}, 2000);
});

const createSceneWithText = (name, text) => {
	k.scene(name, () => {
		k.onDraw(() => {
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
		});
	});

	socket.on(name, () => {
		k.go(name);
	});
};

createSceneWithText('win', 'You win!!!');
createSceneWithText('gameover', 'Game over!!!');

k.go('lobby');
