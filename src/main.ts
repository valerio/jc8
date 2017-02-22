import * as cpu from './cpu';

export function run() {
	let c8 = new cpu.Chip8();
	console.log(c8);

	let canvas = document.createElement('canvas');
	canvas.height = cpu.SCREEN_HEIGHT * 10;
	canvas.width = cpu.SCREEN_WIDTH * 10;

	document.getElementById('container').appendChild(canvas);

	let ctx = canvas.getContext('2d');
	let imgData = ctx.createImageData(cpu.SCREEN_WIDTH, cpu.SCREEN_HEIGHT);
	let imgSize = imgData.data.length;

	let swap = false;
	for (let i = 0; i < imgSize; i += 4) {
		let color = swap ? 0 : 255;
		swap = !swap;
		imgData.data[i] = color;
		imgData.data[i+1] = color;
		imgData.data[i+2] = color;
		imgData.data[i+3] = 255;
	}

	ctx.putImageData(imgData, 0, 0, 0, 0, canvas.width, canvas.height);
}
