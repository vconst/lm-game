import { players } from "./player";

const commissarName = Math.floor(Math.random() * 10000).toString();

const COMMISSAR_SPEED = 150;
const COMMISSAR_EXIT_TIMEOUT = 3000;
const COMMISSAR_FIND_DISTANCE = 500;

const createСommissar = (k, state) => {
    const angle = Math.random() * 2 * Math.PI;
    const commissar = k.add([
        k.sprite("mayor", { width: 50, height: 50 }),
        k.pos(state.mordor.x + 25, state.mordor.y + 80),
    ]);
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
        })
        
        if (targetPlayer) {
            const dX = targetPlayer.pos.x - commissar.pos.x;
            const dY = targetPlayer.pos.y - commissar.pos.y;
            const dLength = Math.sqrt(dX * dX + dY * dY);
            commissar.pos.x += time * COMMISSAR_SPEED * dX / dLength;
            commissar.pos.y += time * COMMISSAR_SPEED * dY / dLength;
        } else {
            commissar.pos.x += time * COMMISSAR_SPEED * Math.sin(angle);
            commissar.pos.y += time * COMMISSAR_SPEED * Math.cos(angle);
        }
    })
    return commissar;
};



export const initCommissars = (k, state) => {
    createСommissar(k, state);
}
