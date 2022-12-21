export const players = {};

const PLAYER_SPEED = 200;

import { width, height } from './map';

export const createPlayer = (k, name, pos) => {
    const randomPosX = Math.floor(Math.random() * (width - 100)) + 50;
    return k.add([
        'player',
        k.sprite(name),
        pos ? k.pos(...pos) : k.pos(randomPosX, 30),
        k.area(),
        {
            name
        }
    ]);
};

const emitPlayerPosition = (socket, player) => {
    socket.emit('updatePlayerPosition', {
        playerName: player.name,
        x: player.pos.x,
        y: player.pos.y,
    });
}

const updatePlayerPosition = (k, { playerName, x, y }) => {
    const isCreated = players[playerName];
    if(!isCreated) {
        players[playerName] = createPlayer(k, playerName);
    }
    const player = players[playerName];
    player.pos.x = x;
    player.pos.y = y;
    // player.moveTo(x, y, isCreated ? PLAYER_SPEED : undefined);
};

const updateCamera = (k, player) => {
    const minCamPos = { x: k.width() / 2, y: k.height() / 2 };
    const maxCamPos = { x: width - k.width() / 2, y: height - k.height() / 2 };
    k.camPos(k.vec2(
        Math.max(Math.min(player.pos.x, maxCamPos.x), minCamPos.x), 
        Math.max(Math.min(player.pos.y, maxCamPos.y), minCamPos.y), 
    ));
}

export const initPlayer = (k, playerName, socket) => {
    const myPlayer = createPlayer(k, playerName);

    players[playerName] = myPlayer;

    socket.emit('addPlayer', {
        playerName,
        x: myPlayer.pos.x,
        y: myPlayer.pos.y
    });

    socket.on('updatePlayerPosition', (options) => updatePlayerPosition(k, options));

    socket.on('addPlayer', (options) => {
        updatePlayerPosition(k, options);
        emitPlayerPosition(socket, myPlayer);
    });

    updateCamera(k, myPlayer);

    return myPlayer;
}

export const movePlayer = (k, player, keys, socket) => {
    let x = 0;
    let y = 0;
    
    if(keys.up || keys.down) {
        y = keys.down ? 1 : -1;
    }
    if(keys.left || keys.right) {
        x = keys.right ? 1 : -1;
    }

    const vectorLength = Math.sqrt(x * x + y * y);

    if(vectorLength) {
        player.move(Math.floor(x / vectorLength * PLAYER_SPEED), Math.floor(y / vectorLength * PLAYER_SPEED));
        player.pos.x = Math.max(player.pos.x, 0);
        player.pos.y = Math.max(player.pos.y, 0);
        player.pos.x = Math.min(player.pos.x, width - player.width);
        player.pos.y = Math.min(player.pos.y, height - player.height);
        emitPlayerPosition(socket, player);
        updateCamera(k, player);
    }
}

