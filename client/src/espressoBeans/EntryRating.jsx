import React, {useCallback, useState} from 'react'
import {useTheme} from '@mui/material/styles'
import {alpha} from '@mui/material'
import RatingTable from '../misc/RatingTable.jsx'

export default function EntryRating({
                                        entry={},
                                        iconsCount = 10,
                                        handleFormChange,
                                        setRatingsChanged = () => {
                                        }
                                    }) {

    console.log('EntryRating', entry)

    const [ratings, setRatings] = useState(entry.ratings || {})
    const ratingDimensions = {rating: 'rating'}
    const handleRatingChange = useCallback(({dimension, rating}) => {
        setRatings({...ratings, [dimension]: rating})
        handleFormChange && handleFormChange({target: {name: 'ratings', value: {...ratings, [dimension]: rating}}})
        setRatingsChanged(true)
    }, [handleFormChange, ratings, setRatingsChanged])

    const theme = useTheme()
    const emptyColor = alpha(theme.palette.text.secondary, 0.2)

    return (
        <div style={{display: 'flex'}}>
            <div style={{fontWeight: 500, fontSize: '1.1rem', marginTop: 2, marginRight: 5}}>Rating</div>
            <RatingTable ratingDimensions={ratingDimensions} onRatingChange={handleRatingChange}
                         ratings={ratings} readonly={false} emptyColor={emptyColor}
                         fontSize={'0.85rem'} size={19} paddingData={0} showLabel={false} iconsCount={iconsCount}/>
        </div>
    )
}