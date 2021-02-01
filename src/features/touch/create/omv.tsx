import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import TextInput from 'components/inputs/text'
import Checkbox from 'components/inputs/checkbox'

export default function OMV({
	createNote,
}: {
	createNote: (note: string) => void
}) {
	const [fullName, setFullName] = useState('')
	const [dob, setDob] = useState('')
	const [last4ssn, setLast4ssn] = useState('')
	const [phone, setPhone] = useState('')
	const [firstLAID, setFirstLAID] = useState(false)
	const [govBenifit, setGovBenifit] = useState('')
	useEffect(() => {
		createNote(
			`Full name:${fullName} \n\nDOB -:${dob} \n\nLast 4 of SSN:${last4ssn} \n\nPhone #: ${phone} \n\nHave they had a LA ID before?: ${
				firstLAID ? 'YES' : 'NO'
			}\n\n${
				firstLAID && 'Confirmed birthcertificate and two forms of ID'
			}\n\nWhat govt benefit they have (Medicaid, SNAP, or SSI): ${govBenifit}`
		)
	}, [fullName, dob, last4ssn, govBenifit, createNote, firstLAID, phone])

	return (
		<Container>
			<TextInput
				value={fullName}
				label="Full Name"
				handleInput={(e) => setFullName(e.target.value)}
			/>
			<TextInput
				value={dob}
				label="DOB"
				handleInput={(e) => setDob(e.target.value)}
			/>
			<TextInput
				value={last4ssn}
				label="Last 4 of SSN"
				handleInput={(e) => setLast4ssn(e.target.value)}
			/>
			<TextInput
				value={phone}
				label="Phone #"
				handleInput={(e) => setPhone(e.target.value)}
			/>
			<Checkbox
				label={'First LA ID?'}
				isSelected={firstLAID}
				onCheckboxChange={() => setFirstLAID(!firstLAID)}
			/>
			{firstLAID && (
				<Message>
					Please confirm they have their birth certificate and two forms of ID
					before continuing{' '}
				</Message>
			)}
			<TextInput
				value={govBenifit}
				label="What govt benefit they have (Medicaid, SNAP, or SSI)"
				handleInput={(e) => setGovBenifit(e.target.value)}
			/>
		</Container>
	)
}

const Message = styled.div`
	font-family: Mulish;
	font-style: normal;
	font-weight: 400;
	font-size: 14px;
	color: #cc0000;
`
const Container = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`
