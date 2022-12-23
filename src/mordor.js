import { height, width } from "./map";


export const initMordor = (k, state) => {
	k.add([
		k.pos(state.mordor.x, state.mordor.y),
		k.sprite('mordor', {
			width: 220,
			height: 142,
		})
	]);
}

export const generateMordorState = () => {
	const posX = Math.floor(Math.random() * (width - 200)) + 100;
	const posY = Math.floor(Math.random() * (height - 200)) + 100;
	return {
		x: posX,
		y: posY,
	}
};
