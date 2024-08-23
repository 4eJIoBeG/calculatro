import { useCallback, useEffect, useState } from 'react'
import { Button, FormControl, Row, Col } from 'react-bootstrap'
import debounce from 'lodash.debounce'

interface CalculateDebtsProps {
	calculateDebts: (expenses: { name: string; spent: number }[]) => void
}

const AddPerson: React.FC<CalculateDebtsProps> = ({ calculateDebts }) => {
	const [people, setPeople] = useState<
		{ name: string; spent: number; index: number }[]
	>([])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedCalculateDebts = useCallback(
		debounce((newPeople: { name: string; spent: number; index: number }[]) => {
			calculateDebts(newPeople.map(({ name, spent }) => ({ name, spent })))
		}, 500),
		[calculateDebts]
	)

	const addPerson = useCallback(() => {
		const newPerson = { name: '', spent: 0, index: Date.now() }
		const newPeople = [...people, newPerson]
		setPeople(newPeople)
		calculateDebts(newPeople)
	}, [people, calculateDebts])

	const changePerson = useCallback(
		(key: string, value: string | number, index: number) => {
			const newPeople = people.map(person =>
				person.index === index ? { ...person, [key]: value } : person
			)
			setPeople(newPeople)
			debouncedCalculateDebts(newPeople)
		},
		[people, debouncedCalculateDebts]
	)

	const removePerson = useCallback(
		(index: number) => {
			const newPeople = people.filter(person => person.index !== index)
			setPeople(newPeople)
			debouncedCalculateDebts(newPeople)
		},
		[people, debouncedCalculateDebts]
	)

	useEffect(() => {
		return () => {
			if (debouncedCalculateDebts && debouncedCalculateDebts.cancel) {
				debouncedCalculateDebts.cancel()
			}
		}
	}, [debouncedCalculateDebts])

	return (
		<>
			<Button
				variant='success'
				className='add-person-button'
				onClick={addPerson}
			>
				Добавить человека
			</Button>
			<div className='add-person'>
				{people.map(person => (
					<Row key={person.index} className='mt-1'>
						<Col md={4} sm={6} className='mb-3'>
							<FormControl
								type='text'
								value={person.name}
								onChange={event =>
									changePerson('name', event.target.value, person.index)
								}
								placeholder='Имя'
							/>
						</Col>
						<Col md={4} sm={6} className='mb-3'>
							<FormControl
								type='number'
								value={person.spent}
								onChange={event =>
									changePerson(
										'spent',
										Number(event.target.value),
										person.index
									)
								}
								placeholder='Потратил'
							/>
						</Col>
						<Col md={4} sm={6} className='mb-3'>
							<Button
								className=''
								variant='danger'
								onClick={() => removePerson(person.index)}
							>
								Удалить
							</Button>
						</Col>
					</Row>
				))}
			</div>
		</>
	)
}

export default AddPerson
