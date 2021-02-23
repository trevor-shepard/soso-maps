import React, { FunctionComponent, useState } from 'react'
import styled from '@emotion/styled'
import { RootState } from 'store/rootReducer'
import { useSelector } from 'react-redux'
import { GroupIcon } from 'assets/icons'
import Logout from 'components/Logout'
import AddProfile from './AddProfile'

const Profile: FunctionComponent = () => {
	const { username, photo } = useSelector((state: RootState) => state.user)
	const [editPhoto, setEditPhoto] = useState(false)

	return (
		<Container>
			<Logout />
			{editPhoto && (
				<AddProfile
					username={username as string}
					hideModal={() => setEditPhoto(false)}
				/>
			)}
			<ProfileImageContainer onClick={() => setEditPhoto(true)}>
				{photo ? (
					<ProfileImage src={photo} />
				) : (
					<ProfileImage src={GroupIcon} />
				)}
			</ProfileImageContainer>
			<Username>{username}</Username>
		</Container>
	)
}

const Container = styled.div`
	height: calc(${() => window.innerHeight}px - 60px);
	width: 100%;
	position: relative;
`

const ProfileImageContainer = styled.div`
	margin-top: 10%;
	width: 100%;
	overflow: hidden;
	border-radius: 100px;
`

const ProfileImage = styled.img`
	height: 178px;
	width: 178px;
	border-radius: 100px;
	object-fit: scale-down;
`
const Username = styled.div`
	font-family: Amsi Pro Narw;
	font-style: normal;
	font-weight: bold;
	font-size: 24px;
	line-height: 120%;
	text-align: center;
	letter-spacing: 0.15px;
`

export default Profile
