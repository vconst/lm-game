import socket from './socket';

import kaboom from 'kaboom';

import { createPlayer, initPlayer, movePlayer, players } from './player';
import { generateFeatureState, initFeatures } from './feature';
import { initTimer } from './timer';
import { width, height } from './map';
import {generateMordorState, initMordor} from "./mordor";
import {initCommissars} from "./commissar";

const k = kaboom({ 
	background: [0, 0, 0],
	global: false,
	// crisp: true,
	// texFilter: 'linear'
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
k.loadSprite("paogame", "img/paogame.png");
k.loadSprite("huicha", "img/paogame_name.png");
k.loadSprite("mordor", "img/mordor.png");
k.loadSprite("mayor", "img/mayor.png");
k.loadSprite("floor", "img/floor.png");

k.focus();

k.scene('intro', async() => {
	const bg = k.add([
		k.sprite('bg4', {
			width: k.width(),
			height: k.height(),
		}),
		k.opacity(1)
	]);

	const paogameSize = {
		width: 500,
		height: 125,
		scale: 1 / 2.5
	}

	const paogamePos = {
		x: [ 
			(k.width() - paogameSize.width) / 2, 
			(k.width() - paogameSize.width * paogameSize.scale) / 2,  
		],
		y: [
			k.height() / 2 - paogameSize.height / 2,
			k.height() / 2 + 20		
		]
	}

	const paogame = k.add([
		k.sprite('paogame', {
			width: paogameSize.width,
			height: paogameSize.height
		}),
		k.pos(paogamePos.x[0], paogamePos.y[0]),
		k.scale(1),
		k.opacity(0)
	]);

	const heichaSize = {
		width: 775,
		height: 125
	}

	const huichaPos = {
		x: [ 
			k.width() / 2, 
			(k.width() - heichaSize.width) / 2,  
		],
		y: [
			k.height() / 2,
			k.height() / 2 - heichaSize.height - 20		
		]
	}

	const huicha = k.add([
		k.sprite('huicha', {
			width: heichaSize.width,
			height: heichaSize.height
		}),
		k.pos(paogamePos.x[0], paogamePos.y[0]),
		k.scale(0),
		k.opacity(0)
	]);

	await k.wait(1);

	const opecityStartTime = k.time();

	k.onUpdate(() => {
		const progress = Math.min((k.time() - opecityStartTime) / 1, 1);
		bg.opacity = 1 - 0.7 * progress;
		paogame.opacity = progress;
	});

	await k.wait(1);

	const moveTextStartTime = k.time();

	const animate = (animation, progress) => animation[1] * progress + animation[0] * (1 - progress);

	k.onUpdate(() => {
		const progress = Math.min((k.time() - moveTextStartTime) / 1, 1);
		paogame.scale.x = paogame.scale.y = animate([1, paogameSize.scale], progress);
		huicha.scale.x = huicha.scale.y = huicha.opacity = animate([0, 1], progress);
		paogame.pos.x = animate(paogamePos.x, progress);
		paogame.pos.y = animate(paogamePos.y, progress);
		huicha.pos.x = animate(huichaPos.x, progress);
		huicha.pos.y = animate(huichaPos.y, progress);
	});

	await k.wait(1);

	const lineWidth = 686;

	const linePos = {
		x: [k.width() / 2, (k.width() - lineWidth)  / 2],
		y: k.height() / 2 - 2
	}

	const line = k.add([
		k.rect(lineWidth, 4),
		k.color(255, 255, 255),
		k.pos(linePos.x[0], linePos.y),
		k.scale(0, 1),
	]);


	const lineStartTime = k.time();

	k.onUpdate(() => {
		const progress = Math.min((k.time() - lineStartTime) / 1, 1);
		line.pos.x = animate(linePos.x, progress);
		line.scale.x = animate([0, 1], progress);
	});

	await k.wait(2);

	k.go('lobby');
});

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
		k.sprite('floor', {
			width: k.width(),
			height: k.height(),
			tiled: true
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

k.go('intro');
