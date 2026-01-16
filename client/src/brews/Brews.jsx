import React, {useContext, useDeferredValue, useState} from 'react'
import BrewCard from './BrewCard.jsx'
import AddNewItemCard from '../profile/AddNewItemCard.jsx'
import Grid from '@mui/material/Grid'
import DataContext from '../context/DataContext.jsx'
import {motion, AnimatePresence} from 'framer-motion'
import FilterDisplayAdvanced from '../filters/FilterDisplayAdvanced.jsx'
import NoMatchingEntriesCard from '../profile/NoMatchingEntriesCard.jsx'

export default function Brews() {
    const {visibleEntries = [], allEntriesCount} = useContext(DataContext)

    const [expanded, setExpanded] = useState(undefined)
    const defExpanded = useDeferredValue(expanded)

    return (
        <div style={{
            minWidth: '320px', height: '100%', width: '100%',
            padding: 0,
            marginLeft: 'auto', marginRight: 'auto', marginTop: 0
        }}>
            <div style={{marginBottom: 10}}>
                <FilterDisplayAdvanced/>
            </div>

            <div style={{width: '100%', marginLeft: 'auto', marginRight: 'auto'}}>

                <Grid container spacing={'6px'} columns={{xs: 1, sm: 1, md: 1}}
                      style={{marginTop: 0, marginLeft: 0, width: '100%'}}>
                    <AnimatePresence>
                        <Grid size={{xs: 4, sm: 4, md: 4}} key={'add-bean-card'}>
                            {visibleEntries.length === 0
                                ? <NoMatchingEntriesCard type={'Brew'} entriesCount={visibleEntries.length}
                                                         allEntriesCount={allEntriesCount}/>
                                : <AddNewItemCard type={'Brew'} count={visibleEntries.length}/>
                            }
                        </Grid>
                        {visibleEntries?.length > 0 &&
                            visibleEntries.filter(x => x)
                                .map((entry, index) =>
                                    <Grid
                                        size={12}
                                        key={entry.id}
                                        component={motion.div}
                                        layout
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        exit={{opacity: 0}}
                                        transition={{type: 'spring', stiffness: 400, damping: 40}}
                                    >
                                        <BrewCard
                                            entry={{...entry, idx: index}}
                                            expanded={entry.id === defExpanded}
                                            onExpand={setExpanded}
                                        />
                                    </Grid>
                                )}
                    </AnimatePresence>
                </Grid>

                <div style={{display: 'block', clear: 'both'}}/>

            </div>
        </div>
    )
}