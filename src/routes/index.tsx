import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold">Hello, sliding puzzle!</h1>
      <p className="text-sm opacity-75 mt-1">
        TanStack Start scaffold is alive. Game logic coming in Sprint 01.
      </p>
    </div>
  )
}
