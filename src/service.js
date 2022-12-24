import { width, height } from "./map";

const correctPos = (val, size) => {
    if(val < 0) {
        return -val
    }
    if(val > size) {
        return size - val;
    }

    return 0;
}

const createService = (k, state) => {
    const service = k.add([
        'service',
        k.sprite('service'),
        k.pos(state.x, state.y),
        k.area(),
        {
            state
        }
    ]);

    service.onDraw(() => {
        if(service.state.time < 0) {
            return;
        }

        const screenPos = k.toScreen(service.pos);
        const x = correctPos(screenPos.x, k.width() - 50);
        const y = correctPos(screenPos.y, k.height() - 30);

        k.drawSprite({
            sprite: 'fire',
            pos: k.vec2(-20, -50)
        });

        k.drawSprite({
            sprite: 'service'
        });

        k.drawCircle({
            pos: k.vec2(x + 30, y + 10),
            radius: 16,
            color: service.state.time < 15 ? k.rgb(230, 97, 94) : k.rgb(240, 240, 255),
        });
        const options = {
            text: service.state.time.toString(),
            font: "sink",
			size: 16,
        }
		const textSize = k.formatText(options);
        k.drawText({
            ...options,
			pos: k.vec2(x + 31 - Math.floor(textSize.width / 2), y + 3),
            color: k.rgb(0, 0, 0),
        });

        k.drawRect({
            width: service.state.progress * service.width,
            height: 10,
            pos: k.vec2(0, -20),
            color: k.GREEN,
            outline: { color: k.BLACK, width: 1 },
        });
    });

    return service;
};

const createServices = (k, state) => {
    return state.services.map((serviceState) => {
        return createService(k, serviceState);
    });
}

export const generateServicesState = (k) => {
    return ['PAO', 'Delivery', 'DOM', 'Gagarin', 'Payment', 'Marketplace'].map((name) => {
        const posX = Math.floor(Math.random() * (width - 200)) + 100;
        const posY = Math.floor(Math.random() * (height - 200)) + 100;
        return {
            name,
            progress: 0,
            x: posX,
            y: posY,
            time: -1
        }
    });
};

export const initServices = (k, state, isHost, socket) => {
    const services = createServices(k, state);

    k.loop(1, () => {
        if(Math.random() < 0.1) {
            const index = Math.floor(Math.random() * state.services.length);
            if(state.services[index].time < 0) {
                state.services[index].time = 30;
            }
        }
    });

    if(isHost) {
        const disposeLoop1 = k.loop(0.2, () => {
            if(state.time > 0) {
                socket.emit('state', state);
            }
        });

        const disposeLoop2 = k.loop(1, () => {
            state.services.forEach(serviceState => {
                if(serviceState.time) {
                    serviceState.time--;
                }
                if(serviceState.time === 0 && state.time > 0) {
                    disposeLoop1();
                    disposeLoop2();
                    socket.emit('gameover');
                    k.go('gameover');
                }
            })
        });
    
        k.onCollide('service', 'player', function(service, player) {
            const disposeUpdate = service.onUpdate(() => {
                if(service.isColliding(player)) {
                    service.state.progress = Math.min(1, service.state.progress + 0.1 * k.dt());
                    if(service.state.progress === 1) {
                        service.state.time = -1;
                        service.state.progress = 0;
                    }
                } else {
                    disposeUpdate();
                }
            });
        });
    } else {
        socket.on('state', (newState) => {
            updateServices(newState);
		});   
    }
}

