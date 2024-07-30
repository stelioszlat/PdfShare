import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styles from './interface.module.css';

const Results = props => {
    const searchResults = useSelector(state => state.files.searchResults);
    const [results, setResults] = useState([])

    useEffect(useCallback(() => {
        setResults(searchResults);
    }), []);

    return (
        <div className={styles['results-list']}>
            {results.map(result => {
                return <div key={result._id}></div>
            })}
        </div>
    );
}

export default Results;