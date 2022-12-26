import { players } from "./player";

import { width, height } from './map';

const commissarName = Math.floor(Math.random() * 10000).toString();

const COMMISSAR_SPEED = 150;
const COMMISSAR_EXIT_TIMEOUT = 3000;
const COMMISSAR_FIND_DISTANCE = 400;

export const initCommissarState = (state) => {
    state.commissar = {
        x: state.mordor.x + 25,
        y: state.mordor.y + 80,
    };
};

const createСommissar = (k, state, isHost, socket) => {
    const commissar = k.add([
        k.sprite("mayor", { width: 50, height: 50 }),
        k.pos(state.commissar.x , state.commissar.y),
    ]);

    if(isHost) {
        let angle = Math.random() * 2 * Math.PI;
        let targetPlayer;
        commissar.onUpdate(() => {
            const time = k.dt();
    
            let minDistance;
            Object.values(players).map(player => {
                const distance = Math.sqrt(Math.pow(player.pos.x - commissar.pos.x, 2) + Math.pow(player.pos.y - commissar.pos.y, 2));
                if ((!minDistance || minDistance > distance) && distance < COMMISSAR_FIND_DISTANCE) {
                    targetPlayer = player;
                    minDistance = distance;
                }
            });
    
            if(minDistance < 50) {
                socket.emit("gameover");
                k.go("gameover");
            }
            
            if (targetPlayer) {
                const isBali = k.testRectPoint(new k.Rect(k.vec2(state.bali.x, state.bali.y), k.vec2(state.bali.x + 200, state.bali.y + 150)), targetPlayer.pos);
                const dX = targetPlayer.pos.x - commissar.pos.x;
                const dY = targetPlayer.pos.y - commissar.pos.y;
                const dLength = Math.sqrt(dX * dX + dY * dY);
                commissar.pos.x += time * COMMISSAR_SPEED * (isBali ? -1 : 1) * dX / dLength;
                commissar.pos.y += time * COMMISSAR_SPEED * (isBali ? -1 : 1) * dY / dLength;
                if(isBali) {
                    targetPlayer = undefined;
                    angle = Math.atan(dX / dY);
                } 
            } else {
                commissar.pos.x += time * COMMISSAR_SPEED * Math.sin(angle);
                commissar.pos.y += time * COMMISSAR_SPEED * Math.cos(angle);
            }
    
            if(commissar.pos.x < 0 || commissar.pos.x > width || commissar.pos.y < 0 || commissar.pos.y > height) {
                commissar.pos.x = state.mordor.x + 25;
                commissar.pos.y = state.mordor.y + 80;
                angle = Math.random() * 2 * Math.PI;
            }
    
            state.commissar.x = commissar.pos.x;
            state.commissar.y = commissar.pos.y;
        });
    } else {
        socket.on('state', (newState) => {
            commissar.pos.x = newState.commissar.x;
            commissar.pos.y = newState.commissar.y;
		});
    }

    return commissar;
};



export const initCommissars = (k, state, isHost, socket) => {
    createСommissar(k, state, isHost, socket);
}
