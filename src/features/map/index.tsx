import React, { useState, useEffect, RefObject } from 'react'
import styled from '@emotion/styled'
import DatePicker, { DayRange, utils } from 'react-modern-calendar-datepicker'
import GoogleMapReact from 'google-map-react'
import { useSelector } from 'react-redux'
import { RootState } from 'store/rootReducer'
import { useHistory } from 'react-router-dom'
import Marker from 'components/marker'

export default function Map() {
	const [lastPress, setlastPress] = useState(0)
	const [Currentlat, setCurrentLat] = useState(29.94639419721249)
	const [Currentlng, setCurrentLng] = useState(-90.07472171802686)

	const [selectedDayRange, setSelectedDayRange] = useState<DayRange>({
		from: {
			year: new Date(Date.now() - 604800000).getFullYear(),
			month: new Date(Date.now() - 604800000).getMonth(),
			day: new Date(Date.now() - 604800000).getDate()
		},
		to: {
			year: new Date().getFullYear(),
			month: new Date().getMonth(),
			day: new Date().getDate()
		}
	})

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

	const renderCustomInput = ({ ref }: { ref: RefObject<HTMLInputElement> }) => (
		<DateInput
			readOnly
			ref={ref} // necessary
			placeholder="I'm a custom input"
			value={
				selectedDayRange.from && selectedDayRange.to
					? `${selectedDayRange.from.month + 1}/${selectedDayRange.from.day}/${
							selectedDayRange.from.year
					  } - ${selectedDayRange.to.month + 1}/${selectedDayRange.to.day}/${
							selectedDayRange.to.year
					  }`
					: 'pick a date range'
			}
			className="my-custom-input-class" // a styling class
		/>
	)

	const touchComponents = Object.values(touches)
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
		.map((touch, i) => <Marker {...touch} key={`touch-${i}`} />)

	return (
		<Container>
			<DatePicker
				value={selectedDayRange}
				onChange={setSelectedDayRange}
				inputPlaceholder="Select a day range"
				// @ts-ignore
				renderInput={renderCustomInput}
				maximumDate={utils('en').getToday()}
				shouldHighlightWeekends
			/>

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
				style={{
					playsInline: true
				}}
				bootstrapURLKeys={{
					key: process.env.REACT_APP_FIREBASE_API_KEY as string
				}}
				defaultCenter={{
					lat: 29.94639419721249,
					lng: -90.07472171802686
				}}
				defaultZoom={15}
			>
				<CurrentLocation
					// @ts-ignore
					lat={Currentlat}
					// @ts-ignore
					lng={Currentlng}
				/>

				{touchComponents}
			</GoogleMapReact>
		</Container>
	)
}

const Container = styled.div`
	height: calc(100% - 60px);
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

const CurrentLocation = styled.div`
	height: 20px;
	width: 20px;
	background-color: #2e8df2;
	border: 3px solid #fff;
	border-radius: 50%;
	box-shadow: 0 0 10px 3px #bbbbbb;
`
