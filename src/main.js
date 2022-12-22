import socket from './socket';

import kaboom from 'kaboom';

import { createPlayer, initPlayer, movePlayer, players } from './player';
import { generateFeatureState, initFeatures } from './feature';
import { initTimer } from './timer';
import { width, height } from './map';
import {generateMordorState, initMordor} from "./mordor";
import {initCommissars} from "./commissar";

const k = kaboom({
	background: [200, 200, 200],
	global: false
 });


for(let i = 1; i <= 20; i++) {
	k.loadSprite(`player${i}`, `img/players/${i}.png`);
}
// k.loadSprite("alex", "img/alex.png");
// k.loadSprite("kostya", "img/kostya.png");
k.loadSprite("feature", "img/feature.png");
k.loadSprite("service", "img/service.png");
k.loadSprite("bg", "img/bg.png");
k.loadSprite("bg2", "img/bg2.png");
k.loadSprite("bg3", "img/bg3.png");
k.loadSprite("bg4", "img/bg4.png");
k.loadSprite("mordor", "img/mordor.png");
k.loadSprite("mayor", "img/mayor.png");

k.focus();

k.scene('lobby', () => {
	k.add([
		k.sprite('bg', {
			width: k.width(),
			height: k.height(),
		})
	]);

	Array.from({ length: 20 }).map((_, index) => `player${index + 1}`).forEach((name, index, names) => {
		const player = createPlayer(k, name, [k.width() / 14 * ((index % 5) + 5), k.height() / (Math.ceil(names.length / 5) + 5) * (Math.floor(index / 5) + 2)]);
		player.onClick(() => {
			k.go('game', name);
		});
	});
});

k.scene('game', (playerName) => {
	k.add([
		k.sprite('bg3', {
			width,
			height,
		})
	]);
	const player = initPlayer(k, playerName, socket);
	const keysMapping = {
		up: ['w', 'ц'],
		down: ['s', 'ы'],
		right: ['d', 'в'],
		left: ['a', 'ф'],
	};
	
	const keys = {};
	
	Object.keys(keysMapping).forEach(realKey => {
		const fullKeys = keysMapping[realKey].concat(realKey);
		k.onKeyPress(fullKeys, () => keys[realKey] = true);
		k.onKeyRelease(fullKeys, () => keys[realKey] = false);
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
				}),
				mordor: generateMordorState()
			}
			socket.emit('state', state);
		}
		
		initMordor(k, state);
		initCommissars(k, state);
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
