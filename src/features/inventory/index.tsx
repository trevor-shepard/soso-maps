import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import { RootState } from 'store/rootReducer'
import TextInput from 'components/inputs/text'
import {
	PageTitle,
	FlexContainer,
	SubmitButton,
	ListItem,
	ItemList,
	ListSwitch,
} from 'components/styled'
import { createItem, updateAmount } from 'store/slices/inventorySlice'
export default function Inventory() {
	const [search, setSearch] = useState('')
	const inventory = useSelector((state: RootState) => state.inventory)
	const [item, setItem] = useState<string | null>(null)
	const [amount, setAmount] = useState(0)
	const [name, setName] = useState('')
	const [current, setCurrent] = useState(0)
	const [ideal, setIdeal] = useState(0)
	const [createToggle, setCreateToggle] = useState(false)
	const [loading, setLoading] = useState(false)

	const items = Object.values(inventory).map(({ name, ideal, current }) => (
		<ListItem
			key={`inventory-item-${name}`}
			onClick={(e) => {
				e.stopPropagation()
				setAmount(current)
				setItem(name)
			}}
		>
			<Name>{name}</Name>

			<Amount>
				<Current enough={current >= ideal}>{current}</Current>/
				<Ideal>{ideal}</Ideal>
			</Amount>
		</ListItem>
	))

	items.push(
		<ListItem onClick={() => setCreateToggle(true)}>
			<Name>Add Item</Name>
		</ListItem>
	)

	const copyShoppersNote = () => {
		let note = 'SHOPPER'
		for (const { current, ideal, name } of Object.values(inventory)) {
			if (current < ideal) {
				note = `${note}\n${name}: ${ideal - current}`
			}
		}
		return navigator.clipboard.writeText(note)
	}

	return (
		<FlexContainer
			onClick={() => {
				if (item) setItem(null)
				if (createToggle) setCreateToggle(false)
			}}
		>
			<ListSwitch onClick={copyShoppersNote}>Copy Shopper Note</ListSwitch>
			<PageTitle>Inventory</PageTitle>
			<TextInput
				label={'search'}
				value={search}
				handleInput={(e) => setSearch(e.target.value)}
			/>
			<ItemList>{items}</ItemList>
			{item !== null && (
				<Modal onClick={(e) => e.stopPropagation()}>
					<PageTitle>{loading ? 'Loading' : `Update ${item} Amount`}</PageTitle>

					<TextInput
						label={'amount'}
						value={amount}
						type="number"
						handleInput={(e) => setAmount(parseInt(e.target.value))}
					/>

					<SubmitButton
						onClick={async () => {
							setLoading(true)
							await updateAmount({ item, current: amount })

							setLoading(false)
							setItem(null)
						}}
					>
						Update Amount
					</SubmitButton>
				</Modal>
			)}
			{createToggle && (
				<Modal onClick={(e) => e.stopPropagation()}>
					<PageTitle>{loading ? 'Loading' : 'Add Item to Inventory'}</PageTitle>

					<TextInput
						label={'item name'}
						value={name}
						type="number"
						handleInput={(e) => setName(e.target.value)}
					/>
					<TextInput
						label={'current'}
						value={current}
						type="number"
						handleInput={(e) => setCurrent(parseInt(e.target.value))}
					/>
					<TextInput
						label={'ideal amount stocked at any time'}
						value={ideal}
						type="number"
						handleInput={(e) => setIdeal(parseInt(e.target.value))}
					/>

					<SubmitButton
						onClick={async () => {
							setLoading(true)
							await createItem({ name, ideal, current })
							setLoading(false)
							setCreateToggle(false)
						}}
					>
						Add Item
					</SubmitButton>
				</Modal>
			)}
		</FlexContainer>
	)
}

const Name = styled.div`
	font-family: Poppins;
	font-style: normal;
	font-weight: 800;
	font-size: 14px;
	line-height: 100%;
	text-align: center;
	letter-spacing: 1px;
	text-transform: uppercase;
	margin-left: 10px;
`

const Amount = styled.div`
	display: flex;
	flex-direction: row;
	margin-right: 10px;
	align-items: center;
`

const Ideal = styled.div`
	font-family: Poppins;
	font-style: normal;
	font-weight: 800;
	font-size: 14px;
	line-height: 120%;
	letter-spacing: 0.177303px;
	color: #262626;
`
const Current = styled.div<{ enough: boolean }>`
	font-family: Poppins;
	font-style: normal;
	font-weight: 800;
	font-size: 14px;
	color: ${({ enough }) => (enough ? '#262626' : 'red')};
`

const Modal = styled.div`
	position: absolute;
	z-index: 1000;
	width: 90%;
	height: 60%;
	top: 20%;
	background-color: white;
	border: 2px solid black;
	border-radius: 3px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
`
