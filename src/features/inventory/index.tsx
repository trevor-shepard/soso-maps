import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import { RootState } from 'store/rootReducer'
import TextInput from 'components/inputs/text'
import {
	PageTitle,
	FlexContainer,

} from 'components/styled'

export default function Inventory() {
	
	const [search, setSearch] = useState('')
	const inventory = useSelector((state: RootState) => state.inventory)	

	const items = Object.values(inventory).map(({name, ideal, current}) => <Item key={`inventory-item-${name}`}>
		<Name>{name}</Name>
		
		<Amount>

			<Current enough={current < ideal}>
			{current}
			</Current>/
			<Ideal>
			{ideal}
			</Ideal>
			
		</Amount>
			  
	</Item>)

	return (
		<FlexContainer>
			<PageTitle>Inventory</PageTitle>
			<TextInput label={'search'} value={search} handleInput={(e) => setSearch(e.target.value)} />
			<ItemList>
				{items}
			</ItemList>
			
		</FlexContainer>
	)
}

const ItemList = styled.div`
	width: 100%;
	height: auto;
	display: flex;
	flex-direction: column;
	align-items: center;

`


const Item = styled.div`
	width: 100%;
	height: auto;
	padding: 10px;
	border: 2px solid black;
	border-radius: 3px;
	&:active {
		box-shadow: 1px 0px 33px 43px rgba(133,127,127,0.75) inset;
	}
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`

const Name = styled.div`
	font-family: Amsi Pro Narw;
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

`

const Ideal = styled.div`
	font-family: Amsi Pro Narw;
	font-style: normal;
	font-weight: 800;
	font-size: 14px;
	line-height: 120%;
	display: flex;
	align-items: center;
	justify-content: center;
	letter-spacing: 0.177303px;
	color: #262626;
	padding-left: 10px;
`
const Current = styled.div<{ enough: boolean}>`
	font-family: Amsi Pro Narw;
	font-style: normal;
	font-weight: 800;
	font-size: 14px;
	line-height: 120%;
	display: flex;
	align-items: center;
	justify-content: center;
	letter-spacing: 0.177303px;
	color: ${({enough})=> enough ? '#262626' : 'red'};
	padding-left: 10px;
`