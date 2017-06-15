import * as cpu from './cpu';

let emulator : cpu.Chip8;
let frameHandle : NodeJS.Timer;
let canvas : HTMLCanvasElement;

export function init() {
	setupCanvas();
	emulator = new cpu.Chip8();

	emulator.loadRomFile('roms/PONG', () => {
		frameHandle = setInterval(frame, 33);
		window.addEventListener("keydown", (e) => {
			emulator.handleKeyDownEvent(e);
		});
		window.addEventListener("keyup", (e) => {
			emulator.handleKeyUpEvent(e);
		});
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

function draw(c8: cpu.Chip8) {
	c8.drawFlag = false;

	let ctx = canvas.getContext('2d');
	let imgData = ctx.getImageData(0, 0, cpu.SCREEN_WIDTH, cpu.SCREEN_HEIGHT);
	let imgSize = imgData.data.length;

	for (let i = 0; i < imgSize; i += 4) {
		let color = c8.vram[i] === 1 ? 255 : 0;
		imgData.data[i] = color;
		imgData.data[i+1] = color;
		imgData.data[i+2] = color;
		imgData.data[i+3] = 255;
	}

	ctx.putImageData(imgData, 0, 0, 0, 0, canvas.width, canvas.height);
}
