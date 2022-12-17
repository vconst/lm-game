const myPlayerName = Math.floor(Math.random() * 10000).toString();
const players = {};

const PLAYER_SPEED = 200;

const createPlayer = (k, pos) => {
    const randomPosX = Math.floor(Math.random() * (k.width() - 100)) + 50;
    return k.add([
        k.sprite("bean"),
        k.pos(randomPosX, 30),
    ]);
};

const emitPlayerPosition = (socket, player) => {
    socket.emit('updatePlayerPosition', {
        playerName: myPlayerName,
        x: player.pos.x,
        y: player.pos.y,
    });
}

const updatePlayerPosition = (k, { playerName, x, y }) => {
    const isCreated = players[playerName];
    if(!isCreated) {
        players[playerName] = createPlayer(k);
    }
    const player = players[playerName];
    player.moveTo(x, y, isCreated ? PLAYER_SPEED : undefined);
};

export const initPlayer = (k, socket) => {
    k.loadBean()

    const myPlayer = createPlayer(k);

    socket.emit('addPlayer', {
        playerName: myPlayerName,
        x: myPlayer.pos.x,
        y: myPlayer.pos.y
    })

    socket.on('updatePlayerPosition', (options) => updatePlayerPosition(k, options));

    socket.on('addPlayer', (options) => {
        updatePlayerPosition(k, options);
        emitPlayerPosition(socket, myPlayer);
    });

    return myPlayer;
}

export const movePlayer = (player, keys, socket) => {
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
        emitPlayerPosition(socket, player);
        console.log(player.pos)
    }
}

