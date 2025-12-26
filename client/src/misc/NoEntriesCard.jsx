import React, {useCallback, useContext} from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import FilterContext from '../context/FilterContext.jsx'

function NoEntriesCard({label}) {
    const {clearFilters} = useContext(FilterContext)
    const style = {
        marginTop: 16,
        maxWidth: 700,
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 0
    }

    const message = <span>No matching {label} were found.<br/>Try adjusting filters, search, or tab.</span>

    const handleClick = useCallback(() => {
        setTimeout(() => {
            clearFilters()
        }, 50)
    }, [clearFilters])

    return (
        <Card style={style}>
            <CardContent style={{paddingBottom: 8}}>
                <Typography variant='h6' align='center'>
                    {message}
                </Typography>
            </CardContent>
                <CardActions style={{paddingBottom: 16}}>
                    <Button
                        variant='outlined'
                        color='inherit'
                        onClick={handleClick}
                        style={{minWidth: 160, margin: 'auto'}}
                    >
                        View all beans
                    </Button>
                </CardActions>
        </Card>
    )
}

export default NoEntriesCard
