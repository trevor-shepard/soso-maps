import React, { useState, useEffect } from 'react'
import TextInput from 'components/inputs/text'

export default function Request({
	createNote,
}: {
	createNote: (note: string) => void
}) {
	const [item, setItem] = useState('')
	const [urgency, setUrgency] = useState('')
	useEffect(() => {
		createNote(`Destination:${item} \n\n- Urgency:${urgency}`)
	}, [createNote, item, urgency])

	return (
		<>
			<TextInput
				value={item}
				label="Item"
				handleInput={(e) => setItem(e.target.value)}
			/>
			<TextInput
				value={urgency}
				label="Urgency"
				handleInput={(e) => setUrgency(e.target.value)}
			/>
		</>
	)
}
