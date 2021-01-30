import React from 'react'
import { MarkerIcon } from 'assets/icons'
import {
	MapMarkerIcon,
	MarkerTitle,
	Marker,
	MarkerTitleHeader,
	MarkerTitleSubHeader,
	MarkerPhoto,
} from 'components/styled'
import { useHistory } from 'react-router-dom'

export default function Component({
	date,
	photo,
	tag,
	id,
}: {
	date: string
	photo: string
	tag: string
	id: string
	lat: number
	lng: number
}) {
	const history = useHistory()

	return (
		<Marker
			onClick={(e) => {
				e.stopPropagation()
				history.push(`touch-detail/${id}`)
			}}
		>
			{photo && <MarkerPhoto src={photo} />}
			<MapMarkerIcon color={'#ffff'} src={MarkerIcon} />
			<MarkerTitle>
				<MarkerTitleHeader>{tag}</MarkerTitleHeader>
				<MarkerTitleSubHeader>
					{new Date(date).toLocaleString('en-US', {
						day: 'numeric',
						month: 'numeric',
						year: 'numeric',
					})}
				</MarkerTitleSubHeader>
			</MarkerTitle>
		</Marker>
	)
}
