import { height, width } from "./map";
import {  initCommissarState } from "./commissar";


export const initMordor = (k, state, isHost) => {
	k.add([
		k.pos(state.mordor.x, state.mordor.y),
		k.area(),
		k.sprite('mordor', {
			width: 220,
			height: 142
		}),
		'mordor'
	]);
	if (isHost){
		
        k.onCollide("mordor", "wall", (mordor, b) => {
			console.log('mordor in wall!')
            state.mordor.x = mordor.pos.x = Math.floor(Math.random() * (width - 200)) + 100;
            state.mordor.y = mordor.pos.y = Math.floor(Math.random() * (height - 200)) + 100;
        });
	}
}

export const generateMordorState = () => {
	const posX = Math.floor(Math.random() * (width - 200)) + 100;
	const posY = Math.floor(Math.random() * (height - 200)) + 100;
	return {
		x: posX,
		y: posY,
	}
};
