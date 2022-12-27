import { height, width } from "./map";


export const initBali = (k, state) => {
	k.add([
		'bali',
		k.pos(state.bali.x, state.bali.y),
        k.area(),
		k.sprite('bali', {
			width: 200,
			height: 150,
		})
	]);
}

export const generateBaliState = () => {
	const posX = Math.floor(Math.random() * (width - 200)) + 100;
	const posY = Math.floor(Math.random() * (height - 200)) + 100;
	return {
		x: posX,
		y: posY,
	}
};
