import React, { FunctionComponent } from 'react'
import styled from '@emotion/styled'

interface TextInputProps {
	handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void
	value: string | number
	label: string
	height?: string
	width?: string
	type?: string
}

const TextInput: FunctionComponent<TextInputProps> = ({
	handleInput,
	value,
	height,
	width,
	label,
	type,
}) => {
	return (
		<Input
			placeholder={label}
			value={value}
			type={type ? type : 'text'}
			onChange={(e) => {
				e.preventDefault()
				handleInput(e)
			}}
			height={height ? height : '40px'}
		/>
	)
}

type InputProps = {
	height?: string
}

const Input = styled.input<InputProps>`
	outline: none;
	font-family: AmsiPro-Ultra;
	width: 90%;
	padding: 12px;
	margin: 6px 0 4px;
	border: 1px solid #ccc;
	background: #fafafa;
	color: #000;
	font-family: sans-serif;
	font-size: 16px;
	line-height: normal;
	box-sizing: border-box;
	border-radius: 2px;
	padding: 5px;
	border: none;
	border-bottom: 6px solid #271600;
	background-color: #ffffff;
	margin-bottom: 10px;
`

export default TextInput
