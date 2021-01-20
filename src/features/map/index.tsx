import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import GoogleMapReact from 'google-map-react'
import { useSelector } from 'react-redux'
import { RootState } from 'store/rootReducer'
import { useHistory } from 'react-router-dom'
import Marker from 'components/marker'
import { Marker as MarkerStyled } from 'components/styled'

export default function Map() {
	const [lastPress, setlastPress] = useState(0)
	const [Currentlat, setCurrentLat] = useState(29.94639419721249)
	const [Currentlng, setCurrentLng] = useState(-90.07472171802686)
	const touches = useSelector((state: RootState) => state.touch)
	const history = useHistory()

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			({ coords: { latitude, longitude } }) => {
				setCurrentLat(latitude)
				setCurrentLng(longitude)
			}
		)
	}, [])

	const touchComponents = Object.values(touches).map((touch, i) => (
		<Marker {...touch} key={`touch-${i}`} />
	))

	return (
		<Container>
			<ListButton
				id="list-view-button"
				onClick={e => {
					e.preventDefault()
					e.stopPropagation()
					history.push('/touch-list')
				}}
			>
				list
			</ListButton>
			<GoogleMapReact
				onClick={async values => {
					const { lat, lng } = values
					const now = Date.now()

					if (now - lastPress < 1000) {
						history.push(`/touch-create/${lat},${lng}`, {
							lat,
							lng
						})
					} else {
						setlastPress(Date.now())
					}
				}}
				bootstrapURLKeys={{
					key: process.env.REACT_APP_FIREBASE_API_KEY as string
				}}
				defaultCenter={{
					lat: 29.94639419721249,
					lng: -90.07472171802686
				}}
				defaultZoom={13}
			>
				<MarkerStyled
					// @ts-ignore
					lat={Currentlat}
					// @ts-ignore
					lng={Currentlng}
				>
					Current Location
				</MarkerStyled>
				{touchComponents}
			</GoogleMapReact>
		</Container>
	)
}

const Container = styled.div`
	height: 100vh;
	width: 100%;
	position: relative;
`

const ListButton = styled.div`
	position: fixed;
	border-radius: 2px;
	background-color: #fff;
	padding: 5px;
	box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
	cursor: pointer;
	top: 10px;
	left: 10px;
	z-index: 10;
	font: 400 11px Roboto, Arial, sans-serif;
	color: #666666;
	width: 25px;
`
