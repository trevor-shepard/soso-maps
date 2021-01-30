import React, { useState, useEffect } from 'react'
import TextInput from 'components/inputs/text'

export default function Ride({
	createNote,
}: {
	createNote: (note: string) => void
}) {
	const [destination, setDestination] = useState('')
	const [urgency, setUrgency] = useState('')
	useEffect(() => {
		createNote(`Destination:${destination} \n\n- Urgency:${urgency}`)
	}, [createNote, destination, urgency])

	return (
		<>
			<TextInput
				value={destination}
				label="Destination"
				handleInput={(e) => setDestination(e.target.value)}
			/>
			<TextInput
				value={urgency}
				label="Urgency"
				handleInput={(e) => setUrgency(e.target.value)}
			/>
		</>
	)
}
