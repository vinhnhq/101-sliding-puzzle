import { startTransition } from "react";
import { type Board as BoardType, indexToRowCol, tryMove } from "~/lib/puzzle";
import { Tile } from "./tile";

type Props = {
	size: number;
	board: BoardType;
	onMove: (next: BoardType) => void;
};

export function Board({ size, board, onMove }: Props) {
	const handleClick = (n: number) => {
		const next = tryMove(board, n, size);
		if (!next) return;
		// startTransition is what activates ViewTransition. Without it
		// the board updates instantly with no animation.
		startTransition(() => onMove(next));
	};

	// Build number → position map so React keys are stable across re-renders.
	// (Rendering by index instead of number would defeat ViewTransition pairing.)
	const positions = new Map<number, { row: number; col: number }>();
	board.forEach((num, idx) => {
		if (num !== 0) positions.set(num, indexToRowCol(idx, size));
	});

	const tiles = [];
	for (let n = 1; n < size * size; n++) {
		const pos = positions.get(n);
		if (!pos) continue;
		tiles.push(
			<Tile
				key={n}
				number={n}
				row={pos.row}
				col={pos.col}
				onClick={() => handleClick(n)}
			/>,
		);
	}

	return (
		<div
			className="board"
			style={{ ["--size" as string]: size } as React.CSSProperties}
		>
			{tiles}
		</div>
	);
}
