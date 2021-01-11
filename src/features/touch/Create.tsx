import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { createMarker } from 'store/slices/markerSlice'
import { useParams, useHistory } from 'react-router-dom'
import {PageTitle, PageSubTitle, SubmitButton, FlexContainer} from 'components/styled'
import { functions} from 'utils/firebase'
import TextInput from 'components/inputs/text'
export default function Create() {
    const history = useHistory()
    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')
    const {coords} = useParams<{ coords: string }>()
    const [lat, lng] = coords.split(',')

    const handleSubmit = () => {
        dispatch(createMarker(parseInt(lat), parseInt(lng), title, Date.now()))
    }


    if (!lat || !lng) history.push('/')



    const getAddress = useCallback(async () => {
        const result = await functions.httpsCallable('getAddress')({
            lat,
            lng
        })
        const { address } = result.data
        setLocation(address)
    }, [])

    useEffect(() => {
        setLocation(coords)
        getAddress()
        
    }, [coords, getAddress])


    
	return <FlexContainer>
        <PageTitle>Create a Touch</PageTitle>
        <PageSubTitle>{location}</PageSubTitle>
        <TextInput value={title} label={'title'} handleInput={(e) => setTitle(e.target.value)} />
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
    </FlexContainer>
}

