import React, { useState, useEffect } from 'react'
import TextInput from 'components/inputs/text'
import styled from '@emotion/styled'

export default function Ride({
	createNote,
	hide,
}: {
	createNote: (note: string) => void
	hide: boolean
}) {
	const [destination, setDestination] = useState('')
	const [urgency, setUrgency] = useState('')
	useEffect(() => {
		createNote(`Destination: ${destination}\nUrgency: ${urgency}`)
	}, [createNote, destination, urgency])

	if (hide) return <></>

	return (
		<Container>
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
