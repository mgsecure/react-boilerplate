import React, {useContext} from 'react'
import Tracker from '../app/Tracker'
import useWindowSize from '../util/useWindowSize'
import Nav from '../nav/Nav'
import Footer from '../nav/Footer.jsx'
import Equipment from './Equipment.jsx'
import DBContext from '../app/DBContext.jsx'
import AuthContext from '../app/AuthContext.jsx'
import DemoBar from '../profile/DemoBar.jsx'
import MustBeLoggedIn from '../profile/MustBeLoggedIn.jsx'
import DataContext from '../context/DataContext.jsx'

export default function EquipmentPage() {
    const {isMobile} = useWindowSize()
    const {demoEnabled} = useContext(DBContext)
    const {isLoggedIn} = useContext(AuthContext)
    const {visibleEntries = []} = useContext(DataContext)

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )
    const footerBefore = (
        <div style={{margin: '30px 0px'}}/>
    )

    return (
        <React.Fragment>
            <Nav title='My Gear' titleMobile='My Gear' extras={extras}/>

            <DemoBar/>
            <div style={{marginBottom: 16}}/>

            {!isLoggedIn && !demoEnabled
                ? <MustBeLoggedIn actionText={'track your gear'}/>
                : <Equipment machines={visibleEntries}/>
            }

            <Tracker feature='equipment'/>
            <Footer before={footerBefore}/>
        </React.Fragment>
    )
}