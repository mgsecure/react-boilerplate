import React, {useDeferredValue, useState} from 'react'
import BeanCard from './BeanCard.jsx'
import AddNewItemCard from './AddNewItemCard.jsx'
import Grid from '@mui/material/Grid'
import {typeSort} from '../data/equipmentBeans'
import {motion, AnimatePresence} from 'framer-motion'

export default function Beans({beans = []}) {

    const [expanded, setExpanded] = useState(undefined)
    const defExpanded = useDeferredValue(expanded)

    return (
        <div style={{
            minWidth: '320px', height: '100%',
            padding: 0,
            marginLeft: 'auto', marginRight: 'auto', marginTop: 0
        }}>
            <div style={{maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto'}}>

                    {beans?.length > 0 &&
                        <Grid container spacing={{xs: '4px', sm: '4px', md: '4px'}} columns={{xs: 1, sm: 1, md: 1}}
                              style={{marginTop: 0, marginLeft: 0}}>
                            <AnimatePresence>
                            <Grid size={{xs: 4, sm: 4, md: 4}} key={'add-bean-card'}>
                                <AddNewItemCard type={'Bean'} count={beans.length}/>
                            </Grid>
                            {[...beans]
                                .sort((a, b) => typeSort(a.type, b.type)
                                    || (a.brand || '').localeCompare(b.brand || '')
                                    || (a.model || '').localeCompare(b.model || ''))
                                .filter(x => x)
                                .map((bean) =>
                                    <Grid size={{xs: 4, sm: 4, md: 4}} key={bean.id}>
                                        <BeanCard
                                            entry={bean}
                                            expanded={bean.id === defExpanded}
                                            onExpand={setExpanded}
                                            component={motion.div}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                                        />
                                    </Grid>
                                )}
                            </AnimatePresence>
                        </Grid>
                    }

                <div style={{display: 'block', clear: 'both'}}/>

            </div>
        </div>
    )
}