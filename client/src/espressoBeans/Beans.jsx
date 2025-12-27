import React, {useContext} from 'react'
import Tracker from '../app/Tracker'
import useWindowSize from '../util/useWindowSize'
import BeanEntries from './BeanEntries.jsx'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import DataContext from '../context/DataContext.jsx'
import {beanSortFields} from '../data/sortFields'

export default function Beans() {
    const {isMobile} = useWindowSize()
    const {visibleEntries = []} = useContext(DataContext)

    const extras = (
        <React.Fragment>
            <SearchBox label='Espresso Beans' extraFilters={[]} keepOpen={false} entryCount={visibleEntries.length}/>
            <ViewFilterButtons entryType={'Bean'} sortValues={beanSortFields} advancedEnabled={true}
                               compactMode={false} resetAll={true} expandAll={true}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='r/espresso beans' titleMobile='r/espresso' extras={extras}/>

            <BeanEntries/>

            <Tracker feature='espressoBeans'/>
        </React.Fragment>
    )
}