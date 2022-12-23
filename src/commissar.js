const commissarName = Math.floor(Math.random() * 10000).toString();

const COMMISSAR_SPEED = 150;
const COMMISSAR_EXIT_TIMEOUT = 3000;

const createСommissar = (k, state) => {
    const angle = Math.random() * 2 * Math.PI;
    const commissar = k.add([
        k.sprite("mayor", { width: 50, height: 50 }),
        k.pos(state.mordor.x + 25, state.mordor.y + 80),
    ]);
    commissar.onUpdate(() => {
        const time = k.dt();
        commissar.pos.x += time * COMMISSAR_SPEED * Math.sin(angle);
        commissar.pos.y += time * COMMISSAR_SPEED * Math.cos(angle);
    })
    return commissar;
};

export const initCommissars = (k, state) => {
    createСommissar(k, state);
}
