import React, {useContext} from 'react'
import Tracker from '../app/Tracker'
import useWindowSize from '../util/useWindowSize'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import DataContext from '../context/DataContext.jsx'
import {brewSortFields} from '../data/sortFields'
import Brews from './Brews.jsx'
import Footer from '../nav/Footer.jsx'
import DemoBar from '../profile/DemoBar.jsx'
import MustBeLoggedIn from '../profile/MustBeLoggedIn.jsx'
import AuthContext from '../app/AuthContext.jsx'
import DBContext from '../app/DBContext.jsx'

export default function BrewsPage() {
    const {isMobile} = useWindowSize()
    const {visibleEntries = []} = useContext(DataContext)
    const {isLoggedIn} = useContext(AuthContext)
    const {demoEnabled} = useContext(DBContext)

    const extras = (
        <React.Fragment>
            <SearchBox label='Brews' extraFilters={[]} keepOpen={false} entryCount={visibleEntries.length}/>
            <ViewFilterButtons entryType={'Brew'} sortValues={brewSortFields} advancedEnabled={false}
                               compactMode={false} resetAll={true} expandAll={false}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )
    const footerBefore = (
        <div style={{margin: '30px 0px'}}/>
    )

    return (
        <React.Fragment>
            <Nav title='All Brews' titleMobile='Brews' extras={extras}/>

            <DemoBar/>
            <div style={{marginBottom: 16}}/>

            {!isLoggedIn && !demoEnabled
                ? <MustBeLoggedIn actionText={'track your brews'}/>
                : <Brews entries={visibleEntries}/>
            }

            <Tracker feature='brews'/>
            <Footer before={footerBefore}/>
        </React.Fragment>
    )
}