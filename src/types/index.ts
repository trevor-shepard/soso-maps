export interface MarkerState {
	[id: string]: Marker
}

export interface Marker {
	id: string
	lat: number
	lng: number
	title: string
	date: number
	location: string
}

export interface User {
	username: string
	uid: string
	email: string
	photo?: string
}

export interface UserState {
	username?: string | null
	uid?: string | null
	email?: string | null
	photo?: string | null
	error: string | null
}

export interface UserWithoutId {
	username: string
	email: string
}
