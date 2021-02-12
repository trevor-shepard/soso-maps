import React, { useState, useEffect } from 'react'
import TextInput from 'components/inputs/text'
import styled from '@emotion/styled'

export default function Request({
	createNote,
	hide,
}: {
	createNote: (note: string) => void
	hide: boolean
}) {
	const [item, setItem] = useState('')
	const [urgency, setUrgency] = useState('')
	useEffect(() => {
		createNote(`Item: ${item}\nUrgency: ${urgency}`)
	}, [createNote, item, urgency])

	if (hide) return <></>

	return (
		<Container>
			PLEASE CONFIRM THIS A FIRST TIME REQUEST
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
	height: auto;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`
