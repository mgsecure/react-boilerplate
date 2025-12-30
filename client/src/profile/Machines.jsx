import React, {useDeferredValue, useState} from 'react'
import MachineCard from './MachineCard'
import AddMachineCard from './AddMachineCard.jsx'
import {useTheme, ThemeProvider, createTheme} from '@mui/material/styles'
import Grid from '@mui/material/Grid'

export default function Machines({machines = []}) {

    const [expanded, setExpanded] = useState(undefined)
    const defExpanded = useDeferredValue(expanded)

    const outerTheme = useTheme()

    const theme = createTheme(outerTheme, {
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 800,
                lg: 1200,
                xl: 1536
            }
        }
    })

    return (

        <div style={{
            minWidth: '320px', height: '100%',
            padding: 0,
            marginLeft: 'auto', marginRight: 'auto', marginTop: 0
        }}>
            <div style={{maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto'}}>

                <ThemeProvider theme={theme}>
                    {machines?.length > 0 &&
                        <Grid container spacing={{xs: 1, sm: 2, md: 2}} columns={{xs: 4, sm: 8, md: 12}}
                              style={{marginTop: 0, marginLeft: 0}}>
                            {machines
                                .filter(x => x)
                                .map((machine) =>
                                    <Grid size={{xs: 4, sm: 4, md: 4}} key={machine.id}>
                                        <MachineCard
                                            machine={machine}
                                            expanded={machine.id === defExpanded}
                                            onExpand={setExpanded}
                                        />
                                    </Grid>
                                )}
                            <Grid size={{xs: 4, sm: 4, md: 4}} key={'add-machine-card'}>
                                <AddMachineCard/>
                            </Grid>
                        </Grid>
                    }
                </ThemeProvider>

                <div style={{display: 'block', clear: 'both'}}/>

            </div>
        </div>
    )
}