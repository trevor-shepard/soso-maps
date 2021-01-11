import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import GoogleMapReact from 'google-map-react'
import { MarkerIcon } from 'assets/icons'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store/rootReducer'
import { subscribeToMarkers, createMarker } from 'store/slices/markerSlice'
import { useHistory } from 'react-router-dom'
export default function Map() {
	const [lastPress, setlastPress] = useState(0)
	const [Currentlat, setCurrentLat] = useState(29.94639419721249)
	const [Currentlng, setCurrentLng] = useState(-90.07472171802686)
	const markers = useSelector((state: RootState) => state.marker)
	const dispatch = useDispatch()
	const history = useHistory()

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
		({ lat, lng, title, location, date }, i) => (
			<Tag
				key={`marker-${i}-date-${date}`}
				// @ts-ignore
				lat={lat}
				// @ts-ignore
				lng={lng}
				name={`marker-${i}`}
				src={Marker}
				onClick={e => {
					e.stopPropagation()
					
				}}
			>
				<Marker src={MarkerIcon} />
				<TagTitle>
					<TagTitleHeader>{title}</TagTitleHeader>
					<TagTitleHeader>{location}</TagTitleHeader>
					<TagTitleSubHeader>{new Date(date).toLocaleString('en-US', {
						day: 'numeric',
						month: 'numeric',
						year: 'numeric'
					})}</TagTitleSubHeader>
					
				</TagTitle>
			</Tag>
		)
	)

	return (
		<Container>
			<GoogleMapReact
				onClick={async (values) => {
					const { lat, lng } = values
					const now = Date.now()
			
					if (now - lastPress < 1000) {

						// dispatch(createMarker(lat, lng, '', Date.now()))
					
						history.push(`/create-touch/${lat},${lng}`, {
							lat,
							lng
						})

					} else {
						setlastPress(Date.now())
					}
				}}
				onChildClick={e => console.log('i clicked')}
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
	cursor: pointer;
`

const Marker = styled.img`
	width: 30px;
	position: absolute;
	left: -15px;
	top: -45px;
`

const TagTitle = styled.div`
	position: absolute;
	width: 50px;
	height: auto;
	left: -25px;
	line-height: 1.2;
	display: flex;
	flex-direction: column;
	justify-content: center;
`
const TagTitleHeader = styled.div`
	font-weight: bold;
`
const TagTitleSubHeader = styled.div``