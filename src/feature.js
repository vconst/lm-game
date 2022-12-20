const createFeature = (k) => {
    const posX = Math.floor(Math.random() * (k.width() - 100)) + 50;
    const posY = Math.floor(Math.random() * (k.height() - 100)) + 50;
    const feature = k.add([
        'feature',
        k.sprite('feature'),
        k.pos(posX, posY),
        k.area(),
        {
            progress: 0
        }
    ]);

    let time = Math.floor(Math.random() * 40 + 20);

    const disposeLoop = k.loop(1, () => {
        if(time) {
            time--;
            if(!time) {
                k.go('gameover');
            }
        }
    });

    feature.on('destroy', disposeLoop);

    feature.onDraw(() => {
        k.drawCircle({
            pos: k.vec2(30, 10),
            radius: 16,
            color: k.rgb(255, 255, 255),
        });
        const options = {
            text: time.toString(),
            font: "sink",
			size: 16,
        }
		const textSize = k.formatText(options);
        k.drawText({
            ...options,
			pos: k.vec2(31 - Math.floor(textSize.width / 2), 3),
            color: k.rgb(0, 0, 0),
        });

        k.drawRect({
            width: feature.progress * feature.width,
            height: 10,
            pos: k.vec2(0, -20),
            color: k.GREEN,
            outline: { color: k.BLACK, width: 1 },
        });
    });

    return feature;
};

export const initFeatures = (k, player) => {
    for(let i = 0; i < 10; i++) {
        createFeature(k);
    }

    player.onCollide('feature', function(feature) {
        const disposeUpdate = feature.onUpdate(() => {
            if(feature.isColliding(player)) {
                feature.progress = Math.min(1, feature.progress + 1 * k.dt());
                if(feature.progress === 1) {
                    feature.destroy();
                    createFeature(k);
                }
            } else {
                disposeUpdate();
            }
        });
    });
}

