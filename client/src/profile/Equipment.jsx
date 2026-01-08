import React, {useDeferredValue, useState} from 'react'
import EquipmentCard from './EquipmentCard.jsx'
import AddNewItemCard from './AddNewItemCard.jsx'
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
            <div style={{maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto'}}>

                    {machines?.length > 0 &&
                        <Grid container spacing={{xs: 1, sm: 1, md: 1}} columns={{xs: 4, sm: 8, md: 12}}
                              style={{marginTop: 0, marginLeft: 0}}>
                            {[...machines]
                                .sort((a, b) => typeSort(a.type, b.type)
                                    || (a.brand || '').localeCompare(b.brand || '')
                                    || (a.model || '').localeCompare(b.model || ''))
                                .filter(x => x)
                                .map((machine) =>
                                    <Grid size={{xs: 4, sm: 4, md: 4}} key={machine.id}>
                                        <EquipmentCard
                                            entry={machine}
                                            expanded={machine.id === defExpanded}
                                            onExpand={setExpanded}
                                        />
                                    </Grid>
                                )}
                            <Grid size={{xs: 4, sm: 4, md: 4}} key={'add-machine-card'}>
                                <AddNewItemCard type={'Equipment'} count={machines.length}/>
                            </Grid>
                        </Grid>
                    }

                <div style={{display: 'block', clear: 'both'}}/>

            </div>
        </div>
    )
}