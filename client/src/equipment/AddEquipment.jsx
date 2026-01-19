import React, {useContext} from 'react'
import useWindowSize from '../util/useWindowSize'
import Nav from '../nav/Nav'
import DataContext from '../context/DataContext.jsx'
import EquipmentForm from './EquipmentForm.jsx'

export default function AddEquipment() {
    const {isMobile} = useWindowSize()
    const {visibleEntries = []} = useContext(DataContext)

    const extras = (
        <React.Fragment>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Add Gear' titleMobile='Add Gear' extras={extras}/>

            <div style={{marginBottom: 16}}/>
            <EquipmentForm entries={visibleEntries}/>

        </React.Fragment>
    )
}