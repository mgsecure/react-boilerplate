import React, {useCallback, useContext, useDeferredValue, useState} from 'react'
import Tracker from '../app/Tracker'
import useWindowSize from '../util/useWindowSize'
import Nav from '../nav/Nav'
import SearchBox from '../nav/SearchBox'
import ViewFilterButtons from '../filters/ViewFilterButtons.jsx'
import DataContext from '../context/DataContext.jsx'
import {roasterSortFields} from '../data/sortFields'
import FilterContext from '../context/FilterContext.jsx'
import ExportButton from '../espressoBeans/ExportButton.jsx'
import AdvancedFilters from '../filters/AdvancedFilters.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import NoEntriesCard from '../misc/NoEntriesCard.jsx'
import RoasterEntry from './RoasterEntry.jsx'
import Footer from '../nav/Footer.jsx'

export default function RoastersPage() {
    const {visibleEntries, expandAll, loading} = useContext(DataContext)
    const {filters} = useContext(FilterContext)
    const [expanded, setExpanded] = useState(filters.id)
    const {isMobile} = useWindowSize()

    const defExpanded = useDeferredValue(expanded)

    const handleExpand = useCallback(id => {
        setExpanded(id)
    }, [])

    const footerBefore = (
        <div style={{margin:'30px 0px'}}>
            <ExportButton text={true} entries={visibleEntries}/>
        </div>
    )

    const extras = (
        <React.Fragment>
            <SearchBox label='Roasters' extraFilters={[]} keepOpen={false} entryCount={visibleEntries.length}/>
            <ViewFilterButtons entryType={'Roaster'} sortValues={roasterSortFields} advancedEnabled={true}
                               compactMode={false} resetAll={true} expandAll={true}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Roasters' titleMobile='Roasters' extras={extras}/>

            <div style={{margin: 8, paddingBottom: 32, width: '100%', maxWidth: 800}}>

                <AdvancedFilters entryType={'Bean'}/>

                { loading && <LoadingDisplay/>}
                {!loading && visibleEntries.length === 0 && <NoEntriesCard label='Roasters'/>}

                {visibleEntries.map(entry =>
                    <RoasterEntry
                        key={entry.id}
                        entry={entry}
                        onExpand={handleExpand}
                        expanded={entry.id === defExpanded || !!expandAll}
                    />
                )}

                <Footer before={footerBefore}/>

            </div>

            <Tracker feature='roasters'/>
        </React.Fragment>
    )
}