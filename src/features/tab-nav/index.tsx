import React, { FunctionComponent, useEffect } from 'react'
import styled from '@emotion/styled'
import { Link, useLocation } from 'react-router-dom'
import { HomeIcon, HamburgerIcon } from 'assets/icons'

const MobileNav: FunctionComponent = () => {
	const { pathname } = useLocation()

	useEffect(() => window.scrollTo(0, 0), [pathname])

	return (
		<Navbar>
			<Tab current={pathname === '/' ? 'true' : 'false'} to="/">
				<TabIcon src={HomeIcon} alt=" " />
				Home
			</Tab>
			<Tab
				current={pathname === '/touch-list' ? 'true' : 'false'}
				to="/touch-list"
			>
				<TabIcon src={HamburgerIcon} alt=" " />
				List
			</Tab>
		</Navbar>
	)
}

export default MobileNav

const Navbar = styled.div`
	height: 60px;
	width: 100%;
	border-top: 1px solid #c4c4c4;
	display: flex;
	justify-content: space-around;
	align-items: center;
	background-color: #ffff;
`
interface TabIconProps {
	current: string
}

const Tab = styled(Link)<TabIconProps>`
	display: flex;
	flex-direction: column;
	align-items: center;
	text-decoration: none;
	font-size: 10px;
	padding: 5px;
	border-radius: 30px;
	height: 36px;
	width: 36px;
`

const TabIcon = styled.img`
	height: 20px;
	width: 20px;
`
