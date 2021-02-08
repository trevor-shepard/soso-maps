import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import TextInput from 'components/inputs/text'

export default function Phone({
	createNote,
	hide,
}: {
	createNote: (note: string) => void
	hide: boolean
}) {
	const [fullName, setFullName] = useState('')
	const [dob, setDob] = useState('')
	const [last4ssn, setLast4ssn] = useState('')
	const [govAddress, setGovAddress] = useState('')
	const [mailingAddress, setMailingAddress] = useState('')
	const [govBenifit, setGovBenifit] = useState('')
	useEffect(() => {
		createNote(
			`
			Full name: ${fullName}\n
			DOB -: ${dob} \n
			Last 4 of SSN: ${last4ssn} \n
			GOV address (what's listed on their ID): ${govAddress} \n
			Mailing address: ${mailingAddress} \n
			What govt benefit they have (Medicaid, SNAP, or SSI): ${govBenifit}`
		)
	}, [
		fullName,
		dob,
		last4ssn,
		govAddress,
		mailingAddress,
		govBenifit,
		createNote,
	])

	if (hide) return <></>

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
				value={govAddress}
				label="GOV address (what's listed on their ID):"
				handleInput={(e) => setGovAddress(e.target.value)}
			/>
			<TextInput
				value={mailingAddress}
				label="Mailing address:"
				handleInput={(e) => setMailingAddress(e.target.value)}
			/>
			<TextInput
				value={govBenifit}
				label="What govt benefit they have (Medicaid, SNAP, or SSI)"
				handleInput={(e) => setGovBenifit(e.target.value)}
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
