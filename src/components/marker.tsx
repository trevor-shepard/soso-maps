import React from 'react'
import { MarkerIcon } from 'assets/icons'
import {
	MapMarkerIcon,
	MarkerTitle,
	Marker,
	MarkerTitleHeader,
	MarkerTitleSubHeader,
	MarkerPhoto
} from 'components/styled'
import { useHistory } from 'react-router-dom'

import { Touch } from 'types'
export default function Component({ title, date, photo, tags, id }: Touch) {
	const history = useHistory()
	const MARKER_COLORS = {
		omv: '#0A5DA6',
		tentRepair: '#F27405',
		request: '#F2B705',
		medical: '#F24405',
		ride: '#0A5DA6',
		phone: '#F2B705',
		outreach: '#F24405',
		misc: '#BF9004'
	}

	const touchColor = tags.length ? MARKER_COLORS[tags[0]] : '#000000'

	return (
		<Marker
			onClick={e => {
				e.stopPropagation()
				history.push(`touch-detail/${id}`)
			}}
			id={`${title}-${date}`}
		>
			{photo && <MarkerPhoto src={photo} />}
			<MapMarkerIcon color={touchColor} src={MarkerIcon} />
			<MarkerTitle>
				<MarkerTitleHeader>{title}</MarkerTitleHeader>
				<MarkerTitleSubHeader>
					{new Date(date).toLocaleString('en-US', {
						day: 'numeric',
						month: 'numeric',
						year: 'numeric'
					})}
				</MarkerTitleSubHeader>
			</MarkerTitle>
		</Marker>
	)
}
