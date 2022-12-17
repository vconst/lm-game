const createPlayer = (k) => {
    const posX = Math.floor(Math.random() * (k.width() - 100)) + 50;
    return k.add([
        k.sprite("bean"),
        k.pos(posX, 30),
    ]);
}

export const initPlayer = (k, socket) => {
    k.loadBean()

    const player = createPlayer(k);

    socket.on('addPlayer', ({ playerName }) => {
        const newPlayer = createPlayer(k);
        socket.on('updatePlayerPosition', (options) => {
            if(options.playerName === playerName) {
                newPlayer.moveTo(options.x, options.y);
            }
        });
    });

    return player;
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
        socket.emit('updatePlayerPosition', {
            playerName: socket.playerName,
            x: player.pos.x,
            y: player.pos.y,
        })
        console.log(player.pos)
    }
}

