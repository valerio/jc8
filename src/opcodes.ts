import {Chip8} from './cpu';

/**
 * SetVxToImmediate implements opcode 6XNN.
 * It will set NN (8 bit immediate) to the register Vx.
 *
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function SetVxToImmediate(c8: Chip8) {
	let x = (c8.opcode & 0x0F00) >> 8;
	let nn = c8.opcode & 0xFF;
	c8.V[x] = nn;
	c8.pc += 2;
}

/**
 * ClearScreen implements opcode 00E0.
 * Resets the screen pixel values
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function ClearScreen(c8: Chip8) {
	for (let i = 0; i < c8.vram.length; i++) {
		c8.vram[i] = 0;
	}
	c8.pc += 2;
}

/**
 * ReturnFromSub implements opcode 00EE.
 * Returns from a subroutine, meaning it will set the PC to the last stack value.
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function ReturnFromSub(c8: Chip8) {
	c8.pc = c8.stack[c8.sp];
	c8.sp++;
	c8.pc += 2;
}

/**
 * JumpAddr implements opcode 1NNN.
 * Sets the program counter to NNN.
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function JumpAddr(c8: Chip8) {
	c8.pc = c8.opcode & 0x0FFF;
}

/**
 * CallSubAtNNN implements opcode 2NNN.
 * It will call the subroutine at address NNN, i.e. move the PC to it.
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function CallSubAtNNN(c8: Chip8) {
	c8.stack[c8.sp] = c8.pc;
	c8.sp--;
	c8.pc = c8.opcode & 0x0FFF;
}

/**
 * SkipIfVxEqualToNN implements opcode 3XNN.
 * It will skip the next instruction if Vx == NN.
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function SkipIfVxEqualToNN(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	let nn = c8.opcode & 0xFF;
	c8.pc += c8.V[x] === nn ? 4 : 2;
}

/**
 * SkipIfVxNotEqualToNN implements opcode 4XNN.
 * It will skip the next instruction if Vx != NN.
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function SkipIfVxNotEqualToNN(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	let nn = c8.opcode & 0xFF;
	c8.pc += c8.V[x] !== nn ? 4 : 2;
}

/**
 * SkipIfVxEqualToVy implements opcode 5XY0.
 * It will skip the next instruction if Vx == Vy.
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function SkipIfVxEqualToVy(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	let y = (c8.opcode >> 4) & 0xF;
	c8.pc += c8.V[x] === c8.V[y] ? 4 : 2;
}

/**
 * AddNNToVx implements opcode 7XNN
 * It will add NN to the Vx register
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function AddNNToVx(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	let nn = (c8.opcode & 0x00FF);
	c8.V[x] += nn;
	c8.pc += 2;
}

/**
 * AssignVyToVx implements opcode 8XY0
 * Assigns the value of Vy to Vx
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function AssignVyToVx(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	let y = (c8.opcode >> 4) & 0xF;
	c8.V[x] = c8.V[y];
	c8.pc += 2;
}

/**
 * VxOrVy implements opcode 8XY1
 * Assigns the value of Vx | Vy to Vx
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function VxOrVy(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	let y = (c8.opcode >> 4) & 0xF;
	c8.V[x] = c8.V[x] | c8.V[y];
	c8.pc += 2;
}

/**
 * VxAndVy implements opcode 8XY2
 * Assigns the value of Vx & Vy to Vx
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function VxAndVy(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	let y = (c8.opcode >> 4) & 0xF;
	c8.V[x] = c8.V[x] & c8.V[y];
	c8.pc += 2;
}

/**
 * VxXorVy implements opcode 8XY3
 * Assigns the value of Vx xor Vy to Vx
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function VxXorVy(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	let y = (c8.opcode >> 4) & 0xF;
	c8.V[x] = c8.V[x] ^ c8.V[y];
	c8.pc += 2;
}

/**
 * AddVyToVx implements opcode 8XY4
 * Math	Vx += Vy	Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there isn't.
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function AddVyToVx(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	let y = (c8.opcode >> 4) & 0xF;

	let result = c8.V[x] + c8.V[y];
	c8.V[0xF] = (result & 0xFF00) > 0 ? 1 : 0;
	c8.V[x] = result & 0xFF;
	c8.pc += 2;
}

/**
 * SubVyToVx implements opcode 8XY5
 * Math	Vx -= Vy	VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function SubVyToVx(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	let y = (c8.opcode >> 4) & 0xF;

	let result = c8.V[x] - c8.V[y];
	c8.V[0xF] = (result & 0xFF00) > 0 ? 0 : 1;
	c8.V[x] = result & 0xFF;
	c8.pc += 2;
}

/**
 * ShiftVxRight implements opcode 8XY6
 * BitOp	Vx >> 1	Shifts VX right by one. VF is set to the value of the least significant bit of VX before the shift.[2]
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function ShiftVxRight(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	let lsb = x & 1;
	c8.V[x] = c8.V[x] >> 1;
	c8.V[0xF] = lsb;
	c8.pc += 2;
}

/**
 * SubVxToVy implements opcode 8XY7
 * Math	Vx=Vy-Vx	Sets VX to VY minus VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function SubVxToVy(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	let y = (c8.opcode >> 4) & 0xF;
	let result = c8.V[y] - c8.V[x];
	c8.V[0xF] = (result & 0xFF00) > 0 ? 0 : 1;
	c8.V[x] = result & 0xFF;
	c8.pc += 2;
}

/**
 * ShiftVxLeft implements opcode 8XYE
 * BitOp	Vx << 1	Shifts VX left by one. VF is set to the value of the most significant bit of VX before the shift.[2]
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function ShiftVxLeft(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	let msb = x & 0x80;
	c8.V[x] = c8.V[x] << 1;
	c8.V[0xF] = msb;
	c8.pc += 2;
}

/**
 * SkipIfVxNotEqualToVy implements opcode 9XY0
 * Cond	if(Vx!=Vy)	Skips the next instruction if VX doesn't equal VY.
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function SkipIfVxNotEqualToVy(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	let y = (c8.opcode >> 4) & 0xF;
	c8.pc = c8.V[x] !== c8.V[y] ? 4 : 2;
}

/**
 * SetMemoryNNN implements opcode ANNN
 * MEM	I = NNN	Sets I to the address NNN.
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function SetMemoryNNN(c8: Chip8) {
	c8.I = c8.opcode & 0x0FFF;
	c8.pc += 2;
}

/**
 * JumpAddrSum implements opcode BNNN
 * Flow PC=V0+NNN	Jumps to the address NNN plus V0.
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function JumpAddrSum(c8: Chip8) {
	c8.pc = (c8.opcode & 0x0FFF) + c8.V[0];
}

/**
 * RandToVx implements opcode CXNN
 * Rand Vx=rand()&NN	Sets VX to the result of a bitwise and operation on a random number (Typically: 0 to 255) and NN.
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function RandToVx(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0x000F;
	let nn = c8.opcode & 0xFF;
	c8.V[x] = Math.floor(Math.random() * 255) & nn;
	c8.pc += 2;
}

/**
 * Draw implements opcode DXYN
 * Disp	draw(Vx,Vy,N)	Draws a sprite at coordinate (VX, VY)
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function Draw(c8: Chip8) {
	let x = c8.V[(c8.opcode >> 8) & 0xF];
	let y = c8.V[(c8.opcode >> 4) & 0xF];
	let height = c8.opcode & 0xF;

	c8.V[0xF] = 0;

	for (let row = 0; row < height; row++) {
		let pixelRow = c8.memory[c8.I+row];

		for (let col = 0; col < 8; col++) {
			// check if pixel went from 0 to 1
			let colMask = 0x80 >> col;
			let pixelUpdated = (colMask & pixelRow) !== 0;
			let pixelAddress = (x + row + ((y + col) * 64));

			if (pixelUpdated) {
				// if pixel was already 1, there's a collision
				let collision = c8.vram[pixelAddress] === 1;

				if (collision) {
					c8.V[0xF] = 1;
				}

				// flip the pixel
				c8.vram[pixelAddress] ^= 1;
			}
		}
	}

	c8.drawFlag = true;
	c8.pc += 2;
}

/**
 * SkipIfKeyPressed implements opcode EX9E
 * KeyOp	if(key()==Vx)	Skips the next instruction if the key stored in VX is pressed. (Usually the next instruction is a jump to skip a code block)
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function SkipIfKeyPressed(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	let keyPressed = c8.keypad[x] !== 0;
	c8.pc += keyPressed ? 4 : 2;
}

/**
 * SkipIfKeyNotPressed implements opcode EXA1
 * KeyOp	if(key()!=Vx)	Skips the next instruction if the key stored in VX isn't pressed. (Usually the next instruction is a jump to skip a code block)
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function SkipIfKeyNotPressed(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	let keyNotPressed = c8.keypad[x] === 0;
	c8.pc += keyNotPressed ? 4 : 2;
}

/**
 * SetVxToDelay implements opcode FX07
 * Timer	Vx = get_delay()	Sets VX to the value of the delay timer.
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function SetVxToDelay(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	c8.V[x] = c8.delayTimer;
	c8.pc += 2;
}

/**
 * WaitForKeyPress implements opcode FX0A
 * KeyOp	Vx = get_key()	A key press is awaited, and then stored in VX. (Blocking Operation. All instruction halted until next key event)
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function WaitForKeyPress(c8: Chip8) {
	c8.stopped = true;
	c8.pc += 2;
}

/**
 * SetDelayToVx implements opcode FX15
 * Timer	delay_timer(Vx)	Sets the delay timer to VX.
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function SetDelayToVx(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	c8.delayTimer = c8.V[x];
	c8.pc += 2;
}

/**
 * SetSoundToVx implements opcode FX18
 * Sound	sound_timer(Vx)	Sets the sound timer to VX.
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function SetSoundToVx(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	c8.soundTimer = c8.V[x];
	c8.pc += 2;
}

/**
 * AddVxToI implements opcode FX1E
 * MEM	I +=Vx	Adds VX to I.[3]
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function AddVxToI(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	c8.I += c8.V[x];
	c8.pc += 2;
}

/**
 * SetIToSpriteAddr implements opcode FX29
 * MEM	I=sprite_addr[Vx]	Sets I to the location of the sprite for the character in VX. Characters 0-F (in hexadecimal) are represented by a 4x5 font.
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function SetIToSpriteAddr(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	c8.I = c8.V[x] * 5;
	c8.pc += 2;
}

/**
 * SetBCD implements opcode FX33
 * BCD	set_BCD(Vx);
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function SetBCD(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;
	let bcdValue = c8.V[x];
	c8.memory[c8.I] = Math.floor(bcdValue / 100);
	c8.memory[c8.I+1] = Math.floor((bcdValue % 100) / 10);
	c8.memory[c8.I+2] = (bcdValue % 100) % 10;
	c8.pc += 2;
}

/**
 * DumpRegisters implements opcode FX55
 * MEM	reg_dump(Vx,&I)	Stores V0 to VX (including VX) in memory starting at address I.[4]
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function DumpRegisters(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;

	for (let i = 0; i <= x; i++) {
		c8.memory[c8.I + i] = c8.V[i];
	}

	c8.pc += 2;
}

/**
 * LoadRegisters implements opcode FX65
 * MEM	reg_load(Vx,&I)	Fills V0 to VX (including VX) with values from memory starting at address I.[4]
 *@param {Chip8} c8 - the chip8 emulator.
 */
export function LoadRegisters(c8: Chip8) {
	let x = (c8.opcode >> 8) & 0xF;

	for (let i = 0; i <= x; i++) {
		c8.V[i] = c8.memory[c8.I + i];
	}

	c8.pc += 2;
}
