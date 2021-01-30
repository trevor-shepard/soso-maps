import React, { useState, useEffect, RefObject, useRef } from 'react'
import styled from '@emotion/styled'
import DatePicker, { DayRange, utils } from 'react-modern-calendar-datepicker'
import GoogleMapReact from 'google-map-react'
import useSupercluster from 'use-supercluster'
import { useSelector } from 'react-redux'
import { RootState } from 'store/rootReducer'
import { useHistory } from 'react-router-dom'
import Marker from 'components/marker'

export default function Map() {
	const history = useHistory()

	// state
	const mapRef = useRef()
	const [lastPress, setlastPress] = useState(0)
	const [currentCoords, setCurrentCoords] = useState([
		29.94639419721249,
		-90.07472171802686,
	])
	const [bounds, setBounds] = useState<number[] | null>(null)
	const [zoom, setZoom] = useState(17)

	const [selectedDayRange, setSelectedDayRange] = useState<DayRange>({
		from: null,
		to: null,
	})
	const touches = useSelector((state: RootState) => state.touch)

	const points = Object.values(touches)
		.filter(({ date }) => {
			if (selectedDayRange.from && selectedDayRange.to) {
				const from = Date.parse(
					`${selectedDayRange.from.month + 1}/${selectedDayRange.from.day}/${
						selectedDayRange.from.year
					}`
				)
				const to = Date.parse(
					`${selectedDayRange.to.month + 1}/${selectedDayRange.to.day}/${
						selectedDayRange.to.year
					}`
				)

				return from < date && date < to
			}

			return true
		})
		.map(({ lat, lng, id, tag, date, photo }) => ({
			type: 'Feature',
			properties: {
				cluster: false,
				id,
				tag,
				date,
				photo,
			},
			geometry: {
				type: 'Point',
				coordinates: [lng, lat],
			},
		}))

	const { clusters, supercluster } = useSupercluster({
		points,
		bounds,
		zoom,
		options: { radius: 75, maxZoom: 20 },
	})

	// on mount effects
	useEffect(() => {
		const oneWeekAgo = new Date(Date.now() - 604800000)
		const tomorrow = new Date()
		tomorrow.setDate(tomorrow.getDate() + 1)
		setSelectedDayRange({
			from: {
				year: oneWeekAgo.getFullYear(),
				month: oneWeekAgo.getMonth(),
				day: oneWeekAgo.getDate(),
			},
			to: {
				year: tomorrow.getFullYear(),
				month: tomorrow.getMonth(),
				day: tomorrow.getDate(),
			},
		})
		navigator.geolocation.getCurrentPosition(
			({ coords: { latitude, longitude } }) => {
				setCurrentCoords([latitude, longitude])
			}
		)
	}, [])

	// recieve props effects
	useEffect(() => {
		const [lat, lng] = currentCoords
		if (mapRef.current !== undefined) {
			// @ts-ignore
			mapRef.current.setZoom(18)
			// @ts-ignore
			mapRef.current.panTo({ lat, lng })
		}
	}, [currentCoords])

	return (
		<Container>
			<DatePicker
				value={selectedDayRange}
				onChange={setSelectedDayRange}
				inputPlaceholder="Select a day range"
				// @ts-ignore
				renderInput={({ ref }: { ref: RefObject<HTMLInputElement> }) => (
					<DateInput
						readOnly
						ref={ref} // necessary
						placeholder="I'm a custom input"
						value={
							selectedDayRange.from && selectedDayRange.to
								? `${selectedDayRange.from.month + 1}/${
										selectedDayRange.from.day
								  }/${selectedDayRange.from.year} - ${
										selectedDayRange.to.month + 1
								  }/${selectedDayRange.to.day}/${selectedDayRange.to.year}`
								: 'pick a date range'
						}
					/>
				)}
				maximumDate={utils('en').getToday()}
				shouldHighlightWeekends
			/>

			<CreateTouch
				id="create-touch"
				onClick={() => {
					const [lat, lng] = currentCoords
					history.push(`/touch-create/${lat},${lng}`, {
						lat,
						lng,
					})
				}}
			>
				Touch
			</CreateTouch>

			<GoogleMapReact
				onClick={async (values) => {
					const { lat, lng } = values
					const now = Date.now()

					if (now - lastPress < 1000) {
						history.push(`/touch-create/${lat},${lng}`, {
							lat,
							lng,
						})
					} else {
						setlastPress(Date.now())
					}
				}}
				style={{
					playsInline: true,
				}}
				bootstrapURLKeys={{
					key: process.env.REACT_APP_FIREBASE_API_KEY as string,
				}}
				defaultCenter={{
					lat: currentCoords[0],
					lng: currentCoords[1],
				}}
				defaultZoom={17}
				yesIWantToUseGoogleMapApiInternals
				onGoogleApiLoaded={({ map }) => {
					mapRef.current = map
				}}
				onChange={({ zoom, bounds }) => {
					setZoom(zoom)
					setBounds([
						bounds.nw.lng,
						bounds.se.lat,
						bounds.se.lng,
						bounds.nw.lat,
					])
				}}
			>
				<CurrentLocation
					// @ts-ignore
					lat={currentCoords[0]}
					// @ts-ignore
					lng={currentCoords[1]}
				/>

				{clusters.map((cluster) => {
					const [lng, lat] = cluster.geometry.coordinates
					const {
						cluster: isCluster,
						point_count: pointCount,
						id,
						date,
						photo,
						tag,
					} = cluster.properties

					if (isCluster) {
						return (
							<Cluster
								key={`${cluster.id}-cluster`}
								className="cluster-marker"
								style={{
									width: `${10 + (pointCount / points.length) * 20}px`,
									height: `${10 + (pointCount / points.length) * 20}px`,
								}}
								onClick={() => {
									const expansionZoom = Math.min(
										supercluster.getClusterExpansionZoom(cluster.id),
										20
									)
									// @ts-ignore
									mapRef.current.setZoom(expansionZoom)
									// @ts-ignore
									mapRef.current.panTo({ lat, lng })
								}}
								// @ts-ignore
								lat={lat}
								lng={lng}
							>
								{pointCount}
							</Cluster>
						)
					}

					return (
						<Marker
							lat={lat}
							lng={lng}
							tag={tag}
							date={date}
							photo={photo}
							id={id}
							key={`touch-${id}`}
						/>
					)
				})}
			</GoogleMapReact>
		</Container>
	)
}

const Container = styled.div`
	height: calc(${() => window.innerHeight}px - 60px);
	width: 100%;
	position: relative;
`

const DateInput = styled.input`
	position: fixed;
	top: 10px;
	left: 10px;
	border-radius: 2px;
	background-color: #fff;
	padding: 5px;
	box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
	cursor: pointer;
	z-index: 10;
	font: 400 11px Roboto, Arial, sans-serif;
	color: #666666;
	width: auto;
`

const CreateTouch = styled.button`
	position: fixed;
	bottom: 180px;
	right: 8px;
	border-radius: 2px;
	background-color: #fff;
	padding: 5px;
	box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
	cursor: pointer;
	z-index: 10;
	font: 400 11px Roboto, Arial, sans-serif;
	color: #666666;
	width: auto;
`

const CurrentLocation = styled.div`
	height: 20px;
	width: 20px;
	background-color: #2e8df2;
	border: 3px solid #fff;
	border-radius: 50%;
	box-shadow: 0 0 10px 3px #bbbbbb;
`

const Cluster = styled.div`
	color: #fff;
	background: #1978c8;
	border-radius: 50%;
	padding: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
`
