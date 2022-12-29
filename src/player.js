export let players = {};

const PLAYER_SPEED = 200;

import { width, height } from './map';

export const createPlayer = (k, name, pos) => {
    const randomPosX = Math.floor(Math.random() * (width - 100)) + 50;
    const player = k.add([
        'player',
        k.sprite(name, { width: 50, height: 50 }),
        pos ? k.pos(...pos) : k.pos(randomPosX, 64),
        k.area(),
        k.z(100),
        {
            name,
            selected: false
        }
    ]);

    player.onDraw(() => {
        k.drawCircle({
            pos: k.vec2(25, 25),
            radius: 25,
            color: player.selected ? k.rgb(230, 97, 94) : k.rgb(255, 255, 255),
        });

        k.drawSprite({
            sprite: name,
            pos: k.vec2(3, 3),
            width: 43,
            height: 43,
        });
    })

    return player;
};

let lastUpdatePosition

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
    // player.pos.x = x;
    // player.pos.y = y;
    player.time = k.time() + (player.time ? Math.max(k.time() - player.time, 0.3) : 0);

    player.cancelAnimation?.();
    player.cancelAnimation = player.onUpdate(() => {
        const fullDt = player.time - k.time();
        const dt = k.dt();
        if(fullDt >= 0) {
            player.pos.x += (x - player.pos.x) * (dt / fullDt);
            player.pos.y += (y - player.pos.y) * (dt / fullDt);
        } else {
            player.pos.x = x;
            player.pos.y = y;
            player.cancelAnimation();
        }
    });

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

export const clearPlayers = () => {
    players = {};
}

export const initPlayer = (k, playerName, socket) => {
    const myPlayer = createPlayer(k, playerName);
    myPlayer.me = true;
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

    k.onCollide("player", "wall", (player, b) => {
        if (player !== myPlayer) return;
        console.log('player in wall!')
        if (player.prevPos){
            player.pos.x = player.prevPos.x;
            player.pos.y = player.prevPos.y;
        } else {
            player.pos.x = Math.floor(Math.random() * (width - 100)) + 50;
        }
        emitPlayerPosition(socket, player);
    });

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
        player.prevPos = {
            x: player.pos.x, y: player.pos.y
        }
        player.move(Math.floor(x / vectorLength * PLAYER_SPEED), Math.floor(y / vectorLength * PLAYER_SPEED));
        player.pos.x = Math.max(player.pos.x, 0);
        player.pos.y = Math.max(player.pos.y, 0);
        player.pos.x = Math.min(player.pos.x, width - player.width);
        player.pos.y = Math.min(player.pos.y, height - player.height);
        emitPlayerPosition(socket, player);
        updateCamera(k, player);
    }
}

