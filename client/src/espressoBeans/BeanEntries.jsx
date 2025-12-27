import React, {useCallback, useContext, useDeferredValue, useState} from 'react'
import DataContext from '../context/DataContext'
import NoEntriesCard from '../misc/NoEntriesCard'
import BeanEntry from './BeanEntry.jsx'
import FilterContext from '../context/FilterContext'
import ExportButton from './ExportButton.jsx'
import Footer from '../nav/Footer.jsx'
import AdvancedFilters from '../filters/AdvancedFilters.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'

function BeanEntries() {
    const {filters} = useContext(FilterContext)
    const [expanded, setExpanded] = useState(filters.id)
    const {visibleEntries, expandAll, loading} = useContext(DataContext)

    const defExpanded = useDeferredValue(expanded)

    const handleExpand = useCallback(id => {
        setExpanded(id)
    }, [])

    const footerBefore = (
        <div style={{margin:'30px 0px'}}>
            <ExportButton text={true} entries={visibleEntries}/>
        </div>
    )

    return (
        <div style={{margin: 8, paddingBottom: 32, width: '100%', maxWidth: 800}}>

            <AdvancedFilters entryType={'Bean'}/>

            { loading && <LoadingDisplay/>}
            {!loading && visibleEntries.length === 0 && <NoEntriesCard label='Safe Locks'/>}

            {visibleEntries.map(entry =>
                <BeanEntry
                    key={entry.id}
                    entry={entry}
                    onExpand={handleExpand}
                    expanded={entry.id === defExpanded || !!expandAll}
                />
            )}

            <Footer before={footerBefore}/>

        </div>
    )
}

export default BeanEntries
