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
	'misc'
]

export interface Touch {
	id: string
	lat: number
	lng: number
	title: string
	notes: string
	date: number
	location: string
	tags: TagType[]
	photo?: string | null
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
