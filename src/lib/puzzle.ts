// Row-major board. 0 represents the empty slot.
// Solved 4×4: [1,2,3,4, 5,6,7,8, 9,10,11,12, 13,14,15,0]
export type Board = number[];

export function createSolved(size: number): Board {
	const b: Board = [];
	for (let i = 1; i < size * size; i++) b.push(i);
	b.push(0);
	return b;
}

export function isSolved(board: Board): boolean {
	for (let i = 0; i < board.length - 1; i++) {
		if (board[i] !== i + 1) return false;
	}
	return board[board.length - 1] === 0;
}

export function indexToRowCol(idx: number, size: number) {
	return { row: Math.floor(idx / size), col: idx % size };
}

function neighborsOf(idx: number, size: number): number[] {
	const { row, col } = indexToRowCol(idx, size);
	const out: number[] = [];
	if (row > 0) out.push(idx - size);
	if (row < size - 1) out.push(idx + size);
	if (col > 0) out.push(idx - 1);
	if (col < size - 1) out.push(idx + 1);
	return out;
}

function swapped(board: Board, a: number, b: number): Board {
	const next = [...board];
	const tmp = next[a];
	next[a] = next[b];
	next[b] = tmp;
	return next;
}

/** Slide the given tile into the empty slot. Returns null if illegal. */
export function tryMove(
	board: Board,
	tileNumber: number,
	size: number,
): Board | null {
	const tileIdx = board.indexOf(tileNumber);
	const emptyIdx = board.indexOf(0);
	if (!neighborsOf(emptyIdx, size).includes(tileIdx)) return null;
	return swapped(board, tileIdx, emptyIdx);
}

/**
 * Walk backwards from solved with random valid moves — guarantees solvability.
 * lastEmpty filter prevents immediate backtracks (slide-left then right wastes a step).
 */
export function shuffle(size: number, steps = 200): Board {
	let board = createSolved(size);
	let lastEmpty = -1;
	for (let i = 0; i < steps; i++) {
		const emptyIdx = board.indexOf(0);
		const choices = neighborsOf(emptyIdx, size).filter((n) => n !== lastEmpty);
		const pick = choices[Math.floor(Math.random() * choices.length)];
		board = swapped(board, emptyIdx, pick);
		lastEmpty = emptyIdx;
	}
	return isSolved(board) ? shuffle(size, steps) : board;
}
