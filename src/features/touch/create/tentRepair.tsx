import React, { useState, useEffect } from 'react'
import TextInput from 'components/inputs/text'
import styled from '@emotion/styled'

export default function TentRepair({
	createNote,
	hide,
}: {
	createNote: (note: string) => void
	hide: boolean
}) {
	const [issue, setissue] = useState('')
	const [urgency, setUrgency] = useState('')
	useEffect(() => {
		createNote(`Issue: ${issue}\nUrgency: ${urgency}`)
	}, [createNote, issue, urgency])

	if (hide) return <></>

	return (
		<Container>
			<TextInput
				value={issue}
				label="Issue"
				handleInput={(e) => setissue(e.target.value)}
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
