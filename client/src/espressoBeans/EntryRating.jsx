import React, {useCallback, useState} from 'react'
import StarRating from '../misc/StarRating.jsx'
import {useTheme} from '@mui/material/styles'
import {alpha} from '@mui/material'

export default function EntryRating({entry}) {

    if (!entry.rating) return null

    const [ratings, setRatings] = useState(entry.rating ? {rating: parseInt(entry.rating)} : {})
    const ratingDimensions = {rating: 'rating'}
    const handleRatingChange = useCallback(({dimension, rating}) => {
        setRatings({...ratings, [dimension]: rating})
        setRatingsChanged(true)
    }, [ratings])

    const theme = useTheme()
    const emptyColor = alpha(theme.palette.text.secondary, 0.2)

    return (
        <StarRating ratings={ratings} dimension={'rating'}
                    readonly={true} size={16} fontSize={'0.85rem'} allowFraction={true} paddingData={0}
                    emptyColor={emptyColor} style={{marginLeft: 5, marginTop: 4}} iconsCount={10}
        />
    )
}