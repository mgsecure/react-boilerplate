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
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import NoMatchingEntriesCard from '../profile/NoMatchingEntriesCard.jsx'
import RoasterEntry from './RoasterEntry.jsx'
import Footer from '../nav/Footer.jsx'
import FilterDisplayAdvanced from '../filters/FilterDisplayAdvanced.jsx'

export default function RoastersPage() {
    const {visibleEntries, allEntriesCount, expandAll, loading} = useContext(DataContext)
    const {filters, filterCount} = useContext(FilterContext)
    const [expanded, setExpanded] = useState(filters.id)
    const {isMobile} = useWindowSize()

    const defExpanded = useDeferredValue(expanded)

    const handleExpand = useCallback(id => {
        setExpanded(id)
    }, [])

    const footerBefore = (
        <div style={{margin: '30px 0px'}}>
            <ExportButton text={true} entries={visibleEntries}/>
        </div>
    )

    const extras = (
        <React.Fragment>
            <SearchBox label='Roasters' extraFilters={[]} keepOpen={false} entryCount={visibleEntries.length}/>
            <ViewFilterButtons entryType={'Roaster'} sortValues={roasterSortFields} advancedEnabled={false}
                               compactMode={false} resetAll={true} expandAll={false}/>
            {!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}
        </React.Fragment>
    )

    return (
        <React.Fragment>
            <Nav title='Roasters' titleMobile='Roasters' extras={extras}/>

            <div style={{marginBottom: 16}}/>
            <div style={{margin: 8, paddingBottom: 32, width: '100%', maxWidth: 800}}>

                {loading && <LoadingDisplay/>}

                {filterCount > 0 &&
                    <div style={{marginBottom: 10}}>
                        <FilterDisplayAdvanced/>
                    </div>
                }

                {!loading && visibleEntries.length === 0 &&
                    <NoMatchingEntriesCard type={'roaster'} entriesCount={visibleEntries.length}
                                             allEntriesCount={allEntriesCount} addNew={false}/>
                }

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