const createFeature = (k) => {
    const posX = Math.floor(Math.random() * (k.width() - 100)) + 50;
    const posY = Math.floor(Math.random() * (k.height() - 100)) + 50;
    const feature = k.add([
        k.sprite('feature'),
        k.pos(posX, posY),
        k.area()
    ]);

    let time = Math.floor(Math.random() * 45 + 15);

    setInterval(() => {
        if(time) {
            time--;
        }
    }, 1000)

    feature.onDraw(() => {
        k.drawCircle({
            pos: k.vec2(30, 10),
            radius: 16,
            color: k.rgb(255, 255, 255),
        })

        k.drawText({
			text: time.toString(),
            font: "sink",
			size: 16,
			pos: k.vec2(19, 3),
            color: k.rgb(0, 0, 0),
        })
    });

    return feature;
};

export const initFeatures = (k) => {
    for(let i = 0; i < 10; i++) {
        createFeature(k);
    }
}

