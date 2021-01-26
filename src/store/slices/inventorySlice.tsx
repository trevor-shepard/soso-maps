import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit'

import { db } from 'utils/firebase'

import { Inventory, Item } from 'types'

const initialState: Inventory = {}

const inventory = createSlice({
	name: 'inventory',
	initialState,
	reducers: {
		recieveInventory(state, action: PayloadAction<Inventory>) {
			const inventory = action.payload

			return {
				...inventory
			}
		},
		inventoryClear() {
			return {}
		}
	}
})

export const { recieveInventory, inventoryClear } = inventory.actions

export default inventory.reducer

export const subscribeToInventory = (dispatch: Dispatch<any>) => {
	const unsubscribe = db.collection('inventory').onSnapshot(querySnapshot => {
		const items: Inventory = {}

		querySnapshot.forEach(doc => {
			const item = doc.data() as Item
			items[item.name] = item
		})

		dispatch(recieveInventory(items))
	})

	return unsubscribe
}

export const createItem = async ({ name, ideal, current }: Item) => {
	try {
		const ref = await db.collection('inventory').doc()
		const item: Item = {
			name,
			ideal,
			current
		}

		await ref.set(item)
	} catch (error) {
		console.log('error creating touch', error)
	}
}

export const updateAmount = async ({
	item,
	current
}: {
	item: string
	current: number
}) => {
	try {
		db.collection('inventory')
			.doc(item)
			.update({ current })
	} catch (error) {
		console.log('error creating touch', error)
	}
}
