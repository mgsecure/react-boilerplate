import React, {useContext, useDeferredValue, useState} from 'react'
import EquipmentCard from './EquipmentCard.jsx'
import AddNewItemCard from '../profile/AddNewItemCard.jsx'
import Grid from '@mui/material/Grid'
import DataContext from '../context/DataContext.jsx'

export default function Equipment() {
    const {visibleEntries = []} = useContext(DataContext)
    const [expanded, setExpanded] = useState(undefined)
    const defExpanded = useDeferredValue(expanded)

    return (

        <div style={{
            minWidth: '320px', height: '100%',
            padding: 0,
            marginLeft: 'auto', marginRight: 'auto', marginTop: 0
        }}>
            <div style={{marginBottom: 10}}/>

            <div style={{maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto'}}>

                    {visibleEntries?.length > 0 &&
                        <Grid container spacing={'6px'} columns={{xs: 4, sm: 8, md: 12}}
                              style={{margin: '0px 4px'}}>
                            {[...visibleEntries]
                                .filter(x => x)
                                .map((machine) =>
                                    <Grid size={{xs: 12, sm: 12, md: 12}} key={machine.id}>
                                        <EquipmentCard
                                            entry={machine}
                                            expanded={machine.id === defExpanded}
                                            onExpand={setExpanded}
                                        />
                                    </Grid>
                                )}
                            <Grid size={12} key={'add-machine-card'}>
                                <AddNewItemCard type={'Gear'} count={visibleEntries.length}/>
                            </Grid>
                        </Grid>
                    }

                <div style={{display: 'block', clear: 'both'}}/>

            </div>
        </div>
    )
}