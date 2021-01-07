export interface MarkerState {
	[id: string]: Marker
}

export interface Marker {
	id: string
	lat: number
	lng: number
	title: string
	date: number
}
