import { width, height } from "./map";

import { tasks } from './tasks';

import CyrillicToTranslit from 'cyrillic-to-translit-js';

const cyrillicToTranslit = new CyrillicToTranslit();

const correctPos = (val, size) => {
    if(val < 0) {
        return -val
    }
    if(val > size) {
        return size - val;
    }

    return 0;
}

const createFeature = (k, state) => {
    const feature = k.add([
        'feature',
        k.sprite('feature'),
        k.pos(state.x, state.y),
        k.area(),
        {
            state
        }
    ]);

    feature.onDraw(() => {
        const screenPos = k.toScreen(feature.pos);
        const x = correctPos(screenPos.x, k.width() - 50);
        const y = correctPos(screenPos.y, k.height() - 30);
        k.drawCircle({
            pos: k.vec2(x + 30, y + 10),
            radius: 16,
            color: feature.state.time < 15 ? k.rgb(230, 97, 94) : k.rgb(255, 255, 255),
        });
        const options = {
            text: feature.state.time.toString(),
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
            width: feature.state.progress * feature.width,
            height: 10,
            pos: k.vec2(0, -20),
            color: k.GREEN,
            outline: { color: k.BLACK, width: 1 },
        });

        const nameOptions = {
            text: feature.state.name,
            font: "sink",
            size: 16,
        }

        try {
            console.log(nameOptions.text);
            const nameTextSize = k.formatText(nameOptions);
            k.drawText({
                ...nameOptions,
                pos: k.vec2(25 - Math.floor(nameTextSize.width / 2), 60),
                color: k.rgb(255, 255, 255),
            });
        } catch(e) {}
    });

    return feature;
};

const createFeatures = (k, state) => {
    return state.features.map((featureState) => {
        return createFeature(k, featureState);
    });
}

export const generateFeaturesState = (k, level) => {
    return Array.from({ length: level * 3 - 1 }).map(() => {
        return generateFeatureState(k);
    });
};

const generateFeatureState = (k) => {
    const posX = Math.floor(Math.random() * (width - 200)) + 100;
    const posY = Math.floor(Math.random() * (height - 200)) + 100;
    const name = tasks[Math.floor(Math.random() * (tasks.length - 1))]
    return {
        name: cyrillicToTranslit.transform(name.length > 40 ? name.slice(0, 40) + '...' : name),
        progress: 0,
        x: posX,
        y: posY,
        time: Math.floor(Math.random() * 40 + 20)
    };
};

export const initFeatures = (k, state, isHost, socket) => {
    const features = createFeatures(k, state);

    const updateFeatures = (newState) => {
        features.forEach((feature, index) => {
            feature.state = newState.features[index];
            feature.pos.x = feature.state.x;
            feature.pos.y = feature.state.y;
        });
    }

    if(isHost) {
        const disposeLoop1 = k.loop(0.2, () => {
            if(state.time > 0) {
                socket.emit('state', state);
            }
        });

        const disposeLoop2 = k.loop(1, () => {
            state.features.forEach(featureState => {
                featureState.time--;
                if(featureState.time <= 0 && state.time > 0) {
                    disposeLoop1();
                    disposeLoop2();
                    socket.emit('gameover');
                    k.go('gameover');
                }
            })
        });
    
        k.onCollide('feature', 'player', function(feature, player) {
            const disposeUpdate = feature.onUpdate(() => {
                if(feature.isColliding(player)) {
                    feature.state.progress = Math.min(1, feature.state.progress + 1 * k.dt());
                    if(feature.state.progress === 1) {
                        // feature.destroy();
                        const index = features.indexOf(feature);
                        state.features.splice(index, 1);
                        const featureState = generateFeatureState(k);
                        state.features.push(featureState);
                        // features.push(createFeature(k, featureState));
                        updateFeatures(state);
                    }
                } else {
                    disposeUpdate();
                }
            });
        });
    } else {
        socket.on('state', (newState) => {
            updateFeatures(newState);
		});
    }
}
