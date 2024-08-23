import { useState } from 'react'
import AddPerson from './components/addPerson/addPerson'

function App() {
	const [bill, setBill] = useState(0)

	const [results, setResults] = useState<
		{ name: string; spent: number; action: string }[]
	>([])

	function calculateDebts(expenses: { name: string; spent: number }[]): void {
		const total = expenses.reduce(
			(sum: number, expense: { name: string; spent: number }) =>
				sum + expense.spent,
			0
		)

		const average = total / expenses.length
		setBill(average)

		const debts = expenses.map(expense => {
			return {
				name: expense.name,
				spent: expense.spent,
				debt: average - expense.spent,
			}
		})

		const results: { name: string; spent: number; action: string }[] = []

		debts.forEach(debt => {
			if (debt.debt < 0) {
				results.push({
					name: debt.name,
					spent: debt.spent,
					action: `должен получить ${Math.abs(debt.debt).toFixed(2)} рублей`,
				})
			} else if (debt.debt > 0) {
				results.push({
					name: debt.name,
					spent: debt.spent,
					action: `должен отдать: ${debt.debt.toFixed(2)} рублей`,
				})
			} else {
				results.push({
					name: debt.name,
					spent: debt.spent,
					action: `не должен никому ничего`,
				})
			}
		})

		setResults(results)
	}

	return (
		<div className='container'>
			<h2>Средняя доля на каждого: {bill.toFixed(2)} руб.</h2>
			{results.map((result, index) => {
				return (
					<div className='person-info' key={index}>
						[<strong>{result?.name.toUpperCase()}</strong>] потратил{' '}
						<strong>{result.spent}</strong> и <strong>{result?.action}</strong>
					</div>
				)
			})}
			<AddPerson calculateDebts={calculateDebts} />
		</div>
	)
}

export default App
