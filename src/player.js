const myPlayerName = Math.floor(Math.random() * 10000).toString();
const players = {};

const createPlayer = (k) => {
    const posX = Math.floor(Math.random() * (k.width() - 100)) + 50;
    return k.add([
        k.sprite("bean"),
        k.pos(posX, 30),
    ]);
};

const emitPlayerPosition = (socket, player) => {
    socket.emit('updatePlayerPosition', {
        playerName: myPlayerName,
        x: player.pos.x,
        y: player.pos.y,
    });
}

const updatePlayerPosition = ({ playerName, x, y }) => {
    if(!players[playerName]) {
        players[playerName] = createPlayer(k);
    }
    const player = players[playerName];
    player.moveTo(x, y);
};

export const initPlayer = (k, socket) => {
    k.loadBean()

    const myPlayer = createPlayer(k);

    socket.emit('addPlayer', {
        playerName: myPlayerName,
        x: myPlayer.pos.x,
        y: myPlayer.pos.y
    })

    socket.on('updatePlayerPosition', updatePlayerPosition);

    socket.on('addPlayer', (options) => {
        updatePlayerPosition(options);
        emitPlayerPosition(socket, myPlayer);
    });

    return myPlayer;
}

export const movePlayer = (player, keys, socket) => {
    let x = 0;
    let y = 0;
    const speed = 200;
    
    if(keys.up || keys.down) {
        y = keys.down ? 1 : -1;
    }
    if(keys.left || keys.right) {
        x = keys.right ? 1 : -1;
    }

    const vectorLength = Math.sqrt(x * x + y * y);

    if(vectorLength) {
        player.move(Math.floor(x / vectorLength * speed), Math.floor(y / vectorLength * speed));
        emitPlayerPosition(socket, player);
        console.log(player.pos)
    }
}

