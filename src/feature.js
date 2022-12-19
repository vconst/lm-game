const createFeature = (k) => {
    const posX = Math.floor(Math.random() * (k.width() - 100)) + 50;
    const posY = Math.floor(Math.random() * (k.height() - 100)) + 50;
    return k.add([
        k.sprite('feature'),
        k.pos(posX, posY),
        k.area()
    ]);
};

export const initFeatures = (k) => {
    for(let i = 0; i < 10; i++) {
        createFeature(k);
    }
}

