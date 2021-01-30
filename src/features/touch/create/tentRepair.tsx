import React, { useState, useEffect } from 'react'
import TextInput from 'components/inputs/text'

export default function TentRepair({
	createNote,
}: {
	createNote: (note: string) => void
}) {
	const [issue, setissue] = useState('')
	const [urgency, setUrgency] = useState('')
	useEffect(() => {
		createNote(`Issue:${issue} \n\n- Urgency:${urgency}`)
	}, [createNote, issue, urgency])

	return (
		<>
			<TextInput
				value={issue}
				label="issue"
				handleInput={(e) => setissue(e.target.value)}
			/>
			<TextInput
				value={urgency}
				label="Urgency"
				handleInput={(e) => setUrgency(e.target.value)}
			/>
		</>
	)
}
