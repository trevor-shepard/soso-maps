import React, { useState, useEffect } from 'react'
import TextInput from 'components/inputs/text'

export default function Phone({
	createNote,
}: {
	createNote: (note: string) => void
}) {
	const [fullName, setFullName] = useState('')
	const [dob, setDob] = useState('')
	const [last4ssn, setLast4ssn] = useState('')
	const [govAddress, setGovAddress] = useState('')
	const [mailingAddress, setMailingAddress] = useState('')
	const [govBenifit, setGovBenifit] = useState('')
	useEffect(() => {
		createNote(
			`Full name:${fullName} \n\nDOB -:${dob} \n\nLast 4 of SSN:${last4ssn} \n\nGOV address (what's listed on their ID):${govAddress} \n\nMailing address:${mailingAddress} \n\nWhat govt benefit they have (Medicaid, SNAP, or SSI): ${govBenifit}`
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

	return (
		<>
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
		</>
	)
}
