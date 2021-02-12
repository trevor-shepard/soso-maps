export interface TouchState {
	[id: string]: Touch
}

export type TagType =
	| 'omv'
	| 'tentRepair'
	| 'request'
	| 'medical'
	| 'ride'
	| 'phone'
	| 'outreach'
	| 'misc'

export const TAGS: TagType[] = [
	'omv',
	'tentRepair',
	'request',
	'medical',
	'ride',
	'phone',
	'outreach',
	'misc',
]

export const TAGS_DISPLAY: { [key in TagType]: string } = {
	omv: 'OMV',
	tentRepair: 'TENT REPAIR',
	request: 'REQUEST',
	medical: 'MEDIC',
	ride: 'RIDE',
	phone: 'PHONE',
	outreach: 'OUTREACH',
	misc: 'MISC',
}

export interface Touch {
	id: string
	lat: number
	lng: number
	notes: string
	date: number
	location: string
	tag: TagType
	photo: string | null
	resolved: boolean
	cMemeber: string | null
	createdBy: string
}

export interface User {
	username: string
	uid: string
	email: string
	photo?: string
	latlng: {
		lat: number
		lng: number
	}
}

export interface UserUpdate {
	username?: string
	photo?: string
	latlng?: {
		lat: number
		lng: number
	}
}

export interface UserState {
	username?: string | null
	uid?: string | null
	email?: string | null
	photo?: string | null
	latlng?: {
		lat: number
		lng: number
	}
	error: string | null
}

export interface UserWithoutId {
	username: string
	email: string
}

export interface CommunityMember {
	name: string
	touches: string[]
	notes: string
	id: string
	location: string | null
	photo: string | null
	lat: number | null
	lng: number | null
}

export interface CommunityMemberState {
	[id: string]: CommunityMember
}

export interface Item {
	ideal: number
	current: number
	name: string
}

export interface Inventory {
	[name: string]: Item
}

export interface LocationState {
	lat: number
	lng: number
}

export interface UsersState {
	[uid: string]: User
}
