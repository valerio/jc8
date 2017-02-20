import * as op from './opcodes'

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

/**
 * The core of the emulator.
 * Implements basic functionality and holds all the required data.
 * @class Chip8
 */
export class Chip8 {
	public I: number;
	public pc: number;
	public sp: number;
	public stack: number[];
	public V: number[];
	public memory: number[];
	public vram: number[];
	public keypad: number[];
	public delayTimer: number;
	public soundTimer: number;
	public opcode: number;
	public drawFlag: boolean;
	public stopped: boolean;

	constructor() {
		this.I = 0;
		this.pc = 0x200;
		this.sp = 0;
		this.stack = new Array(STACK_SIZE);
		this.V = new Array(V_REGISTERS);
		this.memory = new Array(MEMORY_SIZE);
		this.vram = new Array(VRAM_SIZE);
		this.keypad = new Array(16);
		this.delayTimer = 0;
		this.soundTimer = 0;
		this.opcode = 0;
		this.drawFlag = false;
		this.stopped = false;

		for (var i = 0; i < FONT_SET.length; i++) {
			this.memory[i] = FONT_SET[i];
		}
	}

	/**
	 * Loads a ROM into the emulator ram.
	 * @param {number[]} data - an array of bytes to be loaded in the emulator ram.
	 * @memberOf Chip8
	 */
	load(data: number[]) {
		if (data.length > MEMORY_SIZE - 0x200) {
			throw new Error("cannot load ROM, file size exceeds RAM: " + data.length);
		}

		for (var i = 0; i < data.length; i++) {
			this.memory[0x200 + i] = data[i];
		}
	}

	/**
	 * Executes a single cycle of emulation.
	 * @memberOf Chip8
	 */
	step() {
		this.opcode = ((this.memory[this.pc + 1] & 0xFF) << 8) | (this.memory[this.pc] & 0xFF);
		let instr = this.decode(this.opcode);
		instr(this);
	}

	/**
	 * Decodes an opcode and returns a function that implements it.
	 * @param {number} opcode - a 16 bit integer representing one of the opcodes for the chip8.
	 * @return {function(Chip8) : void} a function that implements the opcode.
	 * @memberOf Chip8
	 */
	decode(opcode: number) {
		// placeholder
		return function (c8: Chip8) {
			c8.pc += 2;
		};
	}

}
