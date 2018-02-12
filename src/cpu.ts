import * as op from './opcodes';
import * as fs from 'fs';

export const SCREEN_HEIGHT = 32;
export const SCREEN_WIDTH = 64;
export const STACK_SIZE = 16;
export const MEMORY_SIZE = 4096; // 4kB
export const VRAM_SIZE = SCREEN_HEIGHT * SCREEN_WIDTH;
export const V_REGISTERS = 16;

const FONT_SET = [
	0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
	0x20, 0x60, 0x20, 0x20, 0x70, // 1
	0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
	0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
	0x90, 0x90, 0xF0, 0x10, 0x10, // 4
	0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
	0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
	0xF0, 0x10, 0x20, 0x40, 0x40, // 7
	0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
	0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
	0xF0, 0x90, 0xF0, 0x90, 0x90, // A
	0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
	0xF0, 0x80, 0x80, 0x80, 0xF0, // C
	0xE0, 0x90, 0x90, 0x90, 0xE0, // D
	0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
	0xF0, 0x80, 0xF0, 0x80, 0x80, // F
];

const KEY_MAP = {
	'1': 0,	'2': 1,	'3': 2,	'4': 3,
	'q': 4,	'w': 5,	'e': 6,	'r': 7,
	'a': 8,	's': 9,	'd': 10,'f': 11,
	'z': 12,'x': 13,'c': 14,'v': 15,
};

/**
 * The core of the emulator.
 * Implements basic functionality and holds all the required data.
 * @class Chip8
 */
export class Chip8 {
	public I: number;
	public pc: number;
	public sp: number;
	public stack: Uint16Array;
	public V: Uint8Array;
	public memory: Uint8Array;
	public vram: Uint8Array;
	public keypad: Uint8Array;
	public delayTimer: number;
	public soundTimer: number;
	public opcode: number;
	public drawFlag: boolean;
	public stopped: boolean;

	constructor() {
		this.I = 0;
		this.pc = 0x200;
		this.sp = 0;
		this.stack = new Uint16Array(STACK_SIZE);
		this.V = new Uint8Array(V_REGISTERS);
		this.memory = new Uint8Array(MEMORY_SIZE);
		this.vram = new Uint8Array(VRAM_SIZE);
		this.keypad = new Uint8Array(16);
		this.delayTimer = 0;
		this.soundTimer = 0;
		this.opcode = 0;
		this.drawFlag = false;
		this.stopped = false;

		for (let i = 0; i < FONT_SET.length; i++) {
			this.memory[i] = FONT_SET[i];
		}
	}

	/**
	 * Executes a single cycle of emulation.
	 * @memberOf Chip8
	 */
	public step() {

		if (this.stopped) {
			return;
		}

		this.opcode = ((this.memory[this.pc] & 0xFF) << 8) | (this.memory[this.pc + 1] & 0xFF);
		let instr = this.decode(this.opcode);
		// console.log('execute opcode 0x' + this.opcode.toString(16));

		instr(this);

		if (this.delayTimer > 0) {
			this.delayTimer--;
		}

		if (this.soundTimer > 0) {
			if (this.soundTimer === 1) {
				// TODO: play sound
			}
			this.soundTimer--;
		}

		this.pc &= 0xFFFF;
		this.I &= 0xFFFF;
	}

	public handleKeyDownEvent(event: KeyboardEvent) {
		this.handleInput(event.key, true);
	}

	public handleKeyUpEvent(event: KeyboardEvent) {
		this.handleInput(event.key, false);
	}

	private handleInput(key: string, down: boolean) {
		this.keypad[KEY_MAP[key]] = down ? 1 : 0;
	}

	public loadRomFile(path: string, callback: () => void){
		fs.readFile(path, (err, data) => {
			if (err) {
				throw err;
			}

			this.load(data);
			callback();
		});
	}

	/**
	 * Loads a ROM into the emulator ram.
	 * @param {number[]} data - an array of bytes to be loaded in the emulator ram.
	 * @memberOf Chip8
	 */
	private load(data: Uint8Array) {
		if (data.length > MEMORY_SIZE - 0x200) {
			throw new Error("cannot load ROM, file size exceeds RAM: " + data.length);
		}

		console.log('loading rom file... size: ' + data.length + ' bytes');

		for (let i = 0; i < data.length; i++) {
			this.memory[0x200 + i] = data[i];
		}
	}

	/**
	 * Decodes an opcode and returns a function that implements it.
	 * @param {number} opcode - a 16 bit integer representing one of the opcodes for the chip8.
	 * @return {function(Chip8) : void} a function that implements the opcode.
	 * @memberOf Chip8
	 */
	private decode(opcode: number) {
		switch (opcode & 0xF000) {
			case 0x0:
				switch (opcode & 0x00FF) {
					case 0xE0:
						return op.ClearScreen;
					case 0xEE:
						return op.ReturnFromSub;
				}
				break;
			case 0x1000:
				return op.JumpAddr;
			case 0x2000:
				return op.CallSubAtNNN;
			case 0x3000:
				return op.SkipIfVxEqualToNN;
			case 0x4000:
				return op.SkipIfVxNotEqualToNN;
			case 0x5000:
				return op.SkipIfVxEqualToVy;
			case 0x6000:
				return op.SetVxToImmediate;
			case 0x7000:
				return op.AddNNToVx;
			case 0x8000:
				switch (opcode & 0x000F) {
					case 0x0:
						return op.AssignVyToVx;
					case 0x1:
						return op.VxOrVy;
					case 0x2:
						return op.VxAndVy;
					case 0x3:
						return op.VxXorVy;
					case 0x4:
						return op.AddVyToVx;
					case 0x5:
						return op.SubVyToVx;
					case 0x6:
						return op.ShiftVxRight;
					case 0x7:
						return op.SubVxToVy;
					case 0xE:
						return op.ShiftVxLeft;
				}
			case 0x9000:
				return op.SkipIfVxNotEqualToVy;
			case 0xA000:
				return op.SetMemoryNNN;
			case 0xB000:
				return op.JumpAddrSum;
			case 0xC000:
				return op.RandToVx;
			case 0xD000:
				return op.Draw;
			case 0xE000:
				switch (opcode & 0x000F) {
					case 0xE:
						return op.SkipIfKeyPressed;
					case 0x1:
						return op.SkipIfKeyNotPressed;
				}
			case 0xF000:
				switch (opcode & 0x00FF) {
					case 0x07:
						return op.SetVxToDelay;
					case 0x0A:
						return op.WaitForKeyPress;
					case 0x15:
						return op.SetDelayToVx;
					case 0x18:
						return op.SetSoundToVx;
					case 0x1E:
						return op.AddVxToI;
					case 0x29:
						return op.SetIToSpriteAddr;
					case 0x33:
						return op.SetBCD;
					case 0x55:
						return op.DumpRegisters;
					case 0x65:
						return op.LoadRegisters;
				}
		}
		// if we got here, we got a wrong/unimplemented opcode
		throw new Error("Invalid opcode " + opcode);
	}

}
