import { Activity, useState } from "react";
import { Game } from "./game";

const SIZES = [3, 4, 5] as const;

export function Puzzle() {
	const [active, setActive] = useState<number>(4);

	return (
		<div>
			<div className="tabs" role="tablist">
				{SIZES.map((s) => (
					<button
						key={s}
						type="button"
						role="tab"
						aria-selected={active === s}
						aria-controls={`game-${s}`}
						className={active === s ? "active" : ""}
						onClick={() => setActive(s)}
					>
						{s}×{s}
					</button>
				))}
			</div>

			{/*
				Each Game stays mounted but is hidden when its size isn't active.
				- Without Activity: switching tabs unmounts Game and loses the
				  in-progress board + move count.
				- With Activity: state survives, effects unmount cleanly,
				  updates inside hidden games are deferred.
			*/}
			{SIZES.map((s) => (
				<Activity key={s} mode={active === s ? "visible" : "hidden"}>
					<div role="tabpanel" id={`game-${s}`}>
						<Game size={s} />
					</div>
				</Activity>
			))}
		</div>
	);
}
