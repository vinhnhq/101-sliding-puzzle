import { unstable_ViewTransition as ViewTransition } from "react";

type Props = {
	number: number;
	row: number;
	col: number;
	onClick: () => void;
};

export function Tile({ number, row, col, onClick }: Props) {
	return (
		<ViewTransition name={`tile-${number}`}>
			<button
				type="button"
				className="tile"
				style={{ gridRow: row + 1, gridColumn: col + 1 }}
				onClick={onClick}
				aria-label={`Tile ${number}`}
			>
				{number}
			</button>
		</ViewTransition>
	);
}
