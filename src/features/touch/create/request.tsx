import React, { useState, useEffect } from 'react'
import TextInput from 'components/inputs/text'
import styled from '@emotion/styled'

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
		<Container>
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
		</Container>
	)
}

const Container = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`