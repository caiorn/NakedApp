import { useState } from 'react'

export default function UseStateExample() {
	const [count, setCount] = useState(0)

	return (
		<div className="p-4">
			<h2>useState - Contador</h2>
			<p>Valor atual: {count}</p>
			<button type="button" onClick={() => setCount(count + 1)}>
				Incrementar
			</button>
		</div>
	)
}
