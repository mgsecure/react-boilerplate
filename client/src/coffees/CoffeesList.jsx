import React, {useContext} from 'react'
import Tracker from '../app/Tracker'
import useWindowSize from '../util/useWindowSize'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import DataContext from '../context/DataContext.jsx'
import {brewSortFields} from '../data/sortFields'
import Coffees from './Coffees.jsx'

export default function CoffeesList() {
    const {isMobile} = useWindowSize()
    const {visibleEntries = []} = useContext(DataContext)

    const extras = (
        <React.Fragment>
            <SearchBox label='Coffees' extraFilters={[]} keepOpen={false} entryCount={visibleEntries.length}/>
            <ViewFilterButtons entryType={'Brew'} sortValues={brewSortFields} advancedEnabled={true}
                               compactMode={false} resetAll={true} expandAll={true}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Coffees' titleMobile='Coffees' extras={extras}/>

            <div style={{marginBottom: 16}}/>
            <Coffees entries={visibleEntries}/>

            <Tracker feature='brews'/>
        </React.Fragment>
    )
}