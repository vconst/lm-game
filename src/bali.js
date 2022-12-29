import { height, width } from "./map";


export const initBali = (k, state, isHost) => {
	k.add([
		'bali',
		k.pos(state.bali.x, state.bali.y),
        k.area(),
		k.sprite('bali', {
			width: 200,
			height: 150,
		})
	]);
	
	if(isHost) {
		k.onCollide("bali", "wall", (bali, b) => {
			console.log('bali in wall!')
            state.bali.x = bali.pos.x = Math.floor(Math.random() * (width - 200)) + 100;
            state.bali.y = bali.pos.y = Math.floor(Math.random() * (height - 200)) + 100;
        });
        k.onCollide("bali", "mordor", (bali, mordor) => {
			console.log('bali in mordor!')
            state.bali.x = bali.pos.x = Math.floor(Math.random() * (width - 200)) + 100;
            state.bali.y = bali.pos.y = Math.floor(Math.random() * (height - 200)) + 100;
        });
	}
}

export const generateBaliState = () => {
	const posX = Math.floor(Math.random() * (width - 200)) + 100;
	const posY = Math.floor(Math.random() * (height - 200)) + 100;


	return {
		x: posX,
		y: posY,
	}

};
