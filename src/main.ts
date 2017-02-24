import * as cpu from './cpu';

let emulator : cpu.Chip8;
let frameHandle : NodeJS.Timer;
let canvas : HTMLCanvasElement;

export function init() {
	setupCanvas();

	emulator = new cpu.Chip8();
	emulator.loadRomFile('roms/PONG');

	frameHandle = setInterval(frame, 33);

	window.addEventListener("keydown", emulator.handleKeyDownEvent);
	window.addEventListener("keyup", emulator.handleKeyUpEvent);
}

function frame() {
	try {
		emulator.step();
	} catch (error) {
		clearInterval(frameHandle);
	}
}

function setupCanvas() {
	canvas = document.createElement('canvas');
	canvas.height = cpu.SCREEN_HEIGHT * 10;
	canvas.width = cpu.SCREEN_WIDTH * 10;

	document.getElementById('container').appendChild(canvas);

	let ctx = canvas.getContext('2d');
	let imgData = ctx.createImageData(cpu.SCREEN_WIDTH, cpu.SCREEN_HEIGHT);
	let imgSize = imgData.data.length;

	for (let i = 0; i < imgSize; i += 4) {
		imgData.data[i] = 255;
		imgData.data[i+1] = 255;
		imgData.data[i+2] = 255;
		imgData.data[i+3] = 255;
	}

	ctx.putImageData(imgData, 0, 0, 0, 0, canvas.width, canvas.height);
}
