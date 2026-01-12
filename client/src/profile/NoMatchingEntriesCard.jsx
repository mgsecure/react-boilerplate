import React, {useContext} from 'react'
import {useTheme} from '@mui/material/styles'
import AddNewItemCard from './AddNewItemCard.jsx'
import DBContext from '../app/DBContext.jsx'

export default function NoMatchingEntriesCard({type = 'coffee', entriesCount, allEntriesCount, addNew = true}) {
    const {profileLoaded} = useContext(DBContext)
    const theme = useTheme()

    if ((!profileLoaded) || entriesCount > 0) return null

    return (
        <div
            style={{
                backgroundColor: theme.palette.card?.main,
                marginBottom: 20,
                placeContent: 'center',
                fontSize: '1.3rem',
                fontWeight: 500,
                textAlign: 'center',
                padding: 40,
                borderRadius: 5
            }}>
            {allEntriesCount > 0
                ? `No matching ${type.toLowerCase()}s were found.`
                : 'Nothing here yet.'
            }
            <br/>
            <div style={{fontSize: '1.2rem', fontWeight: 400, marginTop: 5, marginBottom: 30}}>
                {allEntriesCount > 0
                    ? 'Try adjusting filters or search term.'
                    : `Click below to add your first ${type.toLowerCase()}!`
                }
            </div>

            {addNew &&
                <AddNewItemCard type={type} count={1} clearParams={true} action={'noMatch'}/>
            }
        </div>

    )
}
