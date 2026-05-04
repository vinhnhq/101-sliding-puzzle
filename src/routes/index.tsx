import { createFileRoute } from "@tanstack/react-router";
import { Puzzle } from "~/components/puzzle";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<div className="page">
			<h1>Sliding Puzzle</h1>
			<p className="lede">
				Tap a tile next to the empty space to slide it. Get the numbers in
				order.
			</p>
			<Puzzle />
		</div>
	);
}
