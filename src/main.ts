import * as cpu from './cpu';

let emulator : cpu.Chip8;
let frameHandle : NodeJS.Timer;
let canvas : HTMLCanvasElement;

export function init() {
	setupCanvas();
	emulator = new cpu.Chip8();

	emulator.loadRomFile('roms/INVADERS', () => {
		frameHandle = setInterval(frame, 33);
		window.addEventListener("keydown", emulator.handleKeyDownEvent);
		window.addEventListener("keyup", emulator.handleKeyUpEvent);
	});
}

function frame() {
	try {
		emulator.step();

		if (emulator.drawFlag) {
			draw(emulator);
		}

	} catch (error) {
		clearInterval(frameHandle);
		console.error(error);
	}
}

function setupCanvas() {
	canvas = document.getElementById('canvas') as HTMLCanvasElement;

	let ctx = canvas.getContext('2d');
	let imgData = ctx.createImageData(canvas.width, canvas.height);
	let imgSize = imgData.data.length;

	for (let i = 0; i < imgSize; i += 4) {
		imgData.data[i] = 255;
		imgData.data[i+1] = 255;
		imgData.data[i+2] = 255;
		imgData.data[i+3] = 255;
	}

	ctx.putImageData(imgData, 0, 0, 0, 0, canvas.width, canvas.height);
}

function draw(c8: cpu.Chip8) {
	c8.drawFlag = false;

	let ctx = canvas.getContext('2d');
	// let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	let img = new ImageData(cpu.SCREEN_WIDTH, cpu.SCREEN_HEIGHT);
	// let imgData = ctx.getImageData(0, 0, cpu.SCREEN_WIDTH, cpu.SCREEN_HEIGHT);
	// let imgSize = imgData.data.length;

	for (let i = 0; i < c8.vram.length; i++) {
		let imgIndex = i * 4;
		let color = c8.vram[i] === 1 ? 255 : 0;
		img.data[imgIndex] = color;
		img.data[imgIndex+1] = color;
		img.data[imgIndex+2] = color;
		img.data[imgIndex+3] = 255;
	}

	ctx.putImageData(img, 0, 0, 0, 0, canvas.width, canvas.height);
}
