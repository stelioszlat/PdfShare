import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styles from './interface.module.css';

const Results = props => {
    const searchResults = useSelector(state => state.files.searchResults);
    const [results, setResults] = useState([])

    // useEffect(useCallback(() => {
    //     if (!searchResults) {
    //         fetch('http://127.0.0.1:8080/api/search?query=' + query, {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             }
    //         }).then(result => {
    //             result.json().then(response => {
    //                 console.log(response);
    //                 setResults(response.files);
    //             })
    //         }).catch(err => {
    //             console.log(err);
    //         })
    //     } else {
    //         setResults(searchResults);
    //     }
    // }), []);

    return (
        <div className={styles['results-list']}>
            {searchResults.map(result => {
                return <div key={result._id}></div>
            })}
        </div>
    );
}

export default Results;