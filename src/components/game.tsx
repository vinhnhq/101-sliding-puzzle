import { useState } from "react";
import { type Board as BoardType, isSolved, shuffle } from "~/lib/puzzle";
import { Board } from "./board";

export function Game({ size }: { size: number }) {
	const [board, setBoard] = useState<BoardType>(() => shuffle(size));
	const [moves, setMoves] = useState(0);

	const solved = isSolved(board);

	const handleMove = (next: BoardType) => {
		setBoard(next);
		setMoves((m) => m + 1);
	};

	const reshuffle = () => {
		setBoard(shuffle(size));
		setMoves(0);
	};

	return (
		<div>
			{solved ? (
				<div className="win-banner">🎉 Solved in {moves} moves!</div>
			) : (
				<div className="stats">
					<span>
						Moves: <strong>{moves}</strong>
					</span>
					<span>
						Size:{" "}
						<strong>
							{size}×{size}
						</strong>
					</span>
				</div>
			)}

			<Board size={size} board={board} onMove={handleMove} />

			<button type="button" className="shuffle-btn" onClick={reshuffle}>
				{solved ? "Play again" : "Shuffle"}
			</button>
		</div>
	);
}
