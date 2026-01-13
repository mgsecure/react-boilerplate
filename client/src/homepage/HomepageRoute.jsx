import React from 'react'
import {useTheme} from '@mui/material/styles'
import usePageTitle from '../util/usePageTitle.jsx'
import {useNavigate} from 'react-router-dom'
import useWindowSize from '../util/useWindowSize.jsx'
import Nav from '../nav/Nav.jsx'
import Tracker from '../app/Tracker.jsx'
import Footer from '../nav/Footer.jsx'
import Grid from '@mui/material/Grid'
import {Card} from '@mui/material'

export default function HomepageRoute() {
    usePageTitle('Home')
    const navigate = useNavigate()
    const theme = useTheme()
    const {isMobile} = useWindowSize()

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    const footerBefore = null

    const style = {
        backgroundColor: theme.palette.card.add,
        textAlign: 'center',
        padding: '30px 20px 40px',
        height: '100%',
        cursor: 'pointer',
        fontSize: '1.0rem',
        lineHeight: '1.3rem',
    }

    return (
        <>
            <Nav title='Coffee Tracker' titleMobile='Coffee Tracker' extras={extras}/>
            <div style={{marginBottom: 16}}/>

            <div style={{width: '100%', marginLeft: 'auto', marginRight: 'auto', padding:10}}>

                <div style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: 0}}>
                    Welcome!
                </div>
                <div style={{fontSize: '1.0rem', marginBottom: 26}}>
                    Coffee-Tracker.com is a free, open-source site for tracking your coffees, brewing history, and coffee gear.
                </div>

                <Grid container spacing={1} style={{margin: '0px 0px 30px'}} columns={{xs: 4, sm: 8, md: 12}}>
                    <Grid size={12}>
                        <Card style={{...style, padding: 15, backgroundColor: theme.palette.card?.main, cursor: 'default'}}>
                            <div style={{fontSize: '1.2rem', fontWeight: 700}}>Coffee Tracker</div>
                        </Card>
                    </Grid>
                    <Grid size={{xs: 4, sm: 4, md: 4}}>
                        <Card style={style} onClick={() => navigate('/equipment')}>
                            <div style={{fontWeight: 700, marginBottom:5}}>Gear</div>
                            Start here to enter your grinders & gear.
                        </Card>
                    </Grid>
                    <Grid size={{xs: 4, sm: 4, md: 4}}>
                        <Card style={style} onClick={() => navigate('/coffees')}>
                            <div style={{fontWeight: 700, marginBottom:5}}>Coffees</div>
                            Once your gear is set up, add your coffees with full details.
                        </Card>
                    </Grid>
                    <Grid size={{xs: 4, sm: 4, md: 4}}>
                        <Card style={style} onClick={() => navigate('/brews')}>
                            <div style={{fontWeight: 700, marginBottom:5}}>Brews</div>
                            Dial it in by recording brews with different settings.
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={1} style={{margin: '0px 0px 30px'}} columns={{xs: 4, sm: 8, md: 12}}>
                    <Grid size={12}>
                        <Card style={{...style, padding: 15, backgroundColor: theme.palette.card?.main, cursor: 'default'}}>
                            <div style={{fontSize: '1.2rem', fontWeight: 700}}>Resources</div>
                        </Card>
                    </Grid>
                    <Grid size={4}>
                        <Card style={{...style, padding: '40px 20px'}} onClick={() => navigate('/roasters')}>
                            <div style={{fontWeight: 700}}>Popular Roasters</div>
                        </Card>
                    </Grid>
                    <Grid size={4}>
                        <Card style={{...style, padding: '40px 20px'}} onClick={() => navigate('/espressoBeans')}>
                            <div style={{fontWeight: 700}}>r/Espresso Beans Database</div>
                        </Card>
                    </Grid>
                    <Grid size={4}>
                        <Card style={{...style, padding: '40px 20px'}} onClick={() => navigate('/espressoStats')}>
                            <div style={{fontWeight: 700}}>Stats!</div>
                        </Card>
                    </Grid>
                </Grid>

            </div>

            <Tracker feature='homepage'/>
            <Footer before={footerBefore}/>

        </>
    )
}
