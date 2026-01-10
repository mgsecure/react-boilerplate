import React, {useContext} from 'react'
import Tracker from '../app/Tracker'
import useWindowSize from '../util/useWindowSize'
import Nav from '../nav/Nav'
import DataContext from '../context/DataContext.jsx'
import CoffeeForm from './CoffeeForm.jsx'

export default function AddCoffee() {
    const {isMobile} = useWindowSize()
    const {visibleEntries = []} = useContext(DataContext)

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Add Coffee' titleMobile='Add Coffee' extras={extras}/>

            <div style={{marginBottom: 16}}/>
            <CoffeeForm entries={visibleEntries}/>

            <Tracker feature='brews'/>
        </React.Fragment>
    )
}