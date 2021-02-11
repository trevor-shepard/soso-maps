import React, { Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { subscribeToTouches, touchClear } from 'store/slices/touchSlice'
import { subscribeToInventory, inventoryClear } from 'store/slices/inventorySlice'
import { subscribeToCommunityMembers, cMemberClear } from 'store/slices/communitymemberSlice'
import { subscribeToUsers, usersClear } from "store/slices/usersSlice";

export default function Subscribe() {
	const dispatch = useDispatch()

	useEffect(() => {
		subscribeToTouches(dispatch)
		subscribeToCommunityMembers(dispatch)
		subscribeToInventory(dispatch)
		subscribeToUsers(dispatch)
		return ()=> {
			touchClear()
			inventoryClear()
			cMemberClear()
			usersClear()
		}
	}, [dispatch])
	return <Fragment />
}
