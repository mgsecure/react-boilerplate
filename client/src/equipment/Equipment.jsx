import React, {useDeferredValue, useState} from 'react'
import EquipmentCard from './EquipmentCard.jsx'
import AddNewItemCard from '../profile/AddNewItemCard.jsx'
import Grid from '@mui/material/Grid'
import {typeSort} from '../data/equipmentBeans'

export default function Equipment({machines = []}) {

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

                    {machines?.length > 0 &&
                        <Grid container spacing={'6px'} columns={{xs: 4, sm: 8, md: 12}}
                              style={{margin: '0px 4px'}}>
                            {[...machines]
                                .sort((a, b) => typeSort(a.type, b.type)
                                    || (a.brand || '').localeCompare(b.brand || '')
                                    || (a.model || '').localeCompare(b.model || ''))
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
                                <AddNewItemCard type={'Gear'} count={machines.length}/>
                            </Grid>
                        </Grid>
                    }

                <div style={{display: 'block', clear: 'both'}}/>

            </div>
        </div>
    )
}