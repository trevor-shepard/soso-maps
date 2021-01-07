import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import GoogleMapReact from 'google-map-react'
import {MarkerIcon} from 'assets/icons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store/rootReducer'
import { subscribeToMarkers, createMarker } from 'store/slices/markerSlice'

export default function Map() {

	const [Currentlat, setCurrentLat] = useState(29.94639419721249)
	const [Currentlng, setCurrentLng] = useState(-90.07472171802686)
	const markers = useSelector((state: RootState) => state.marker)
	const dispatch = useDispatch()

	useEffect(() => subscribeToMarkers(dispatch), [dispatch])

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			({ coords: { latitude, longitude } }) => {
				setCurrentLat(latitude)
				setCurrentLng(longitude)
			}
		)
	}, [])

	const markerComponents = Object.values(markers).map(
		({ lat, lng, title, date }, i) => (
			<Tag
				key={`marker-${i}-date-${date}`}
				// @ts-ignore
				lat={lat}
				// @ts-ignore
				lng={lng}
				name={`marker-${i}`}
				src={Marker}
			>
				<Marker src={MarkerIcon} />
				<Title>{ new Date(date).toLocaleString("en-US", {day: 'numeric', month: 'short', year: 'numeric'}) }</Title>
			</Tag>
		)
	)

	

	return (
		<Container>
			<GoogleMapReact
				onClick={({ lat, lng }) => {
					
					dispatch(createMarker(lat, lng, 'new marker', Date.now()))
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
				<Tag
					// @ts-ignore
					lat={Currentlat}
					// @ts-ignore
					lng={Currentlng}
					name="My Marker"
				>
					Current Location
				</Tag>
					{markerComponents}
			</GoogleMapReact>
		</Container>
	)
}

const Container = styled.div`
	height: 100vh;
	width: 100%;
`

const Tag = styled.div`
	font-family: 'Amiri';
	font-weight: bold;
	position: relative;
`

const Marker = styled.img`
	width: 30px;
	position: absolute;
	left: -15px;
	top: -45px;
`

const Title = styled.div`
	position: absolute;
	width: 50px;
	height: auto;
	left: -25px;
	line-height: 1.2;
`
