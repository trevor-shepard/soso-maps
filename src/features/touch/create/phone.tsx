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
			<input
				value={fullName}
				placeholder="Full Name"
				onChange={(e) => setFullName(e.target.value)}
			/>
			<input
				value={dob}
				placeholder="DOB"
				onChange={(e) => setDob(e.target.value)}
			/>
			<input
				value={last4ssn}
				placeholder="Last 4 of SSN"
				onChange={(e) => setLast4ssn(e.target.value)}
			/>
			<input
				value={govAddress}
				placeholder="GOV address (what's listed on their ID):"
				onChange={(e) => setGovAddress(e.target.value)}
			/>
			<input
				value={mailingAddress}
				placeholder="Mailing address:"
				onChange={(e) => setMailingAddress(e.target.value)}
			/>
			<input
				value={govBenifit}
				placeholder="What govt benefit they have (Medicaid, SNAP, or SSI)"
				onChange={(e) => setGovBenifit(e.target.value)}
			/>
		</>
	)
}
