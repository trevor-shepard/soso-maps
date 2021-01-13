import React from 'react'
import { MarkerIcon } from 'assets/icons'
import {
	MapMarkerIcon,
	TagTitle,
	Tag,
	TagTitleHeader,
	TagTitleSubHeader,
	MarkerPhoto
} from 'components/styled'



import { Marker } from 'types'
export default function Component({ title, location, date, photo, tags }: Marker) {
	
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


	const markerColor = tags.length ? MARKER_COLORS[tags[0]] : '#000000'

	return (
		<Tag
			onClick={e => {
				e.stopPropagation()
			}}
			id={`${title}-${date}`}
		>
			{ photo && <MarkerPhoto src={photo} /> }
			<MapMarkerIcon color={markerColor} src={MarkerIcon} />
			<TagTitle>
				<TagTitleHeader>{title}</TagTitleHeader>
				<TagTitleSubHeader>
					{new Date(date).toLocaleString('en-US', {
						day: 'numeric',
						month: 'numeric',
						year: 'numeric'
					})}
				</TagTitleSubHeader>
			</TagTitle>
		</Tag>
	)
}
