import socket from './socket';

import kaboom from 'kaboom';

import { createPlayer, initPlayer, movePlayer, players, clearPlayers } from './player';
import { generateFeaturesState, initFeatures } from './feature';
import { generateServicesState, initServices } from './service';
import { initTimer } from './timer';
import { width, height } from './map';
import { generateMordorState, initMordor } from "./mordor";
import { initCommissars } from "./commissar";

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
k.loadSprite("start", "img/start.png");
k.loadSprite("fire", "img/fire.png");

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
	let selectedPlayer;
	k.add([
		k.sprite('bg', {
			width: k.width(),
			height: k.height(),
		})
	]);

	const disposeLoop = k.loop(1, () => {
		if(selectedPlayer) {
			socket.emit('playerState', { name: selectedPlayer.name, selected: true });
		}
	});

	const players = Array.from({ length: 20 }).map((_, index) => `player${index + 1}`).map((name, index, names) => {
		const player = createPlayer(k, name, [k.width() / 14 * ((index % 5) + 5), k.height() / (Math.ceil(names.length / 5) + 5) * (Math.floor(index / 5) + 2)]);
		return player;
	});

	socket.on('playerState', ({ name, selected }) => {
		players.find(p => p.name === name).selected = selected;
    });

	socket.on('state', () => {
		if(selectedPlayer) {
			const name = selectedPlayer.name;
			selectedPlayer = undefined;
			disposeLoop();
			k.go('game', name);
		}
    });

	const startButton = k.add([
		k.sprite('start'),
		k.pos((k.width() - 320) / 2, k.height() * 0.7),
		k.area(),
		k.opacity(0),
	]);

	startButton.onClick(() => {
		if(selectedPlayer) {
			disposeLoop();
			k.go('game', selectedPlayer.name);
		}
	});

	k.onClick('player', (player) => {
		if(player.selected) {
			return;
		}
		if(selectedPlayer) {
			selectedPlayer.selected = false;
			socket.emit('playerState', { name: selectedPlayer.name, selected: false });
		}
		player.selected = true;
		selectedPlayer = player;
		startButton.opacity = 1;
	});
});

const generateState = (level, hostName) => {
	const state = {
		level,
		host: hostName,
		time: 60,
		features: generateFeaturesState(k, level),
		services: generateServicesState(k, level),
		mordor: generateMordorState()
	}
	socket.emit('state', state);

	return state;
}

k.scene('game', (playerName, level = 1) => {
	clearPlayers();

	k.add([
		k.sprite('floor', {
			width,
			height,
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

	const updateState = (newState) => {
		if(state && newState.level > state.level) {
			socket.off('state', updateState);
			k.go('game', playerName, newState.level);
		}
		state = newState;
	}

	socket.on('state', updateState);

	setTimeout(() => {
		const isHost = !state;
		if(state) {
			console.log('host is', state.host);
		} else {
			console.log('I am host');
			state = generateState(level, player.name);
		}
		
		initMordor(k, state);
		initCommissars(k, state);
		initTimer(k, state, isHost, socket, () => {
			if(state.level  === 2) {
				socket.emit('win');
				k.go('win');
				return;
			} else {
				k.go('game', playerName, level + 1);
			}
		});
		initFeatures(k, state, isHost, socket);
		initServices(k, state, isHost, socket);
	}, 1000);
});

const createSceneWithText = (name, text) => {
	k.scene(name, async () => {
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
			window.location.reload();
			// k.go('lobby');
		});

		await k.wait(3);

		window.location.reload();
		// k.go('lobby');
	});

	socket.on(name, () => {
		k.go(name);
	});
};

createSceneWithText('win', 'You win!!!');
createSceneWithText('gameover', 'Game over!!!');

k.go('intro');
