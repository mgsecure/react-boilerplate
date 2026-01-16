import React, {useContext} from 'react'
import Tracker from '../app/Tracker'
import useWindowSize from '../util/useWindowSize'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import DataContext from '../context/DataContext.jsx'
import {coffeeSortFields} from '../data/sortFields'
import Coffees from './Coffees.jsx'
import Footer from '../nav/Footer.jsx'
import DemoBar from '../profile/DemoBar.jsx'
import AuthContext from '../app/AuthContext.jsx'
import MustBeLoggedIn from '../profile/MustBeLoggedIn.jsx'
import DBContext from '../app/DBContext.jsx'

export default function CoffeesPage() {
    const {isMobile} = useWindowSize()
    const {visibleEntries = []} = useContext(DataContext)
    const {isLoggedIn} = useContext(AuthContext)
    const {profileLoaded, demoEnabled} = useContext(DBContext)

    const extras = (
        <React.Fragment>
            <SearchBox label='Coffees' extraFilters={[]} keepOpen={false} entryCount={visibleEntries.length}/>
            <ViewFilterButtons entryType={'Coffee'} sortValues={coffeeSortFields} advancedEnabled={false}
                               compactMode={false} resetAll={true} expandAll={false}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    const footerBefore = (
        <div style={{margin: '30px 0px'}}/>
    )

    return (
        <React.Fragment>
            <Nav title='My Coffees' titleMobile='Coffees' extras={extras}/>

            <DemoBar/>
            <div style={{marginBottom: 16}}/>

            {profileLoaded && !isLoggedIn && !demoEnabled
                ? <MustBeLoggedIn actionText={'track your coffees'}/>
                : <Coffees/>
            }

            <Tracker feature='coffees'/>
            <Footer before={footerBefore}/>

        </React.Fragment>
    )
}