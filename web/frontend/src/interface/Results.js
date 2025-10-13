import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styles from './interface.module.css';
import { useParams } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import { searchFile } from '../services/metadata-service';

const Results = props => {
    const searchResults = useSelector(state => state.files.searchResults);
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const [results, setResults] = useState([])

    useEffect(() => {
        if (params) {
            setResults(params.searchResults);
        } else {
            setResults(searchResults);
        }
        const searchHandler = async () => {
            if (!results) {
                const result = await searchFile(searchParams.get('query'))
                const response = await result.json();
                setResults(response.files);
            }
        };

        searchHandler();
    }, []);

    

    return (
        <div className="container">
            <div className={styles['results-list']}>
                {searchResults?.map(result => {
                    return <div key={result._id}></div>
                })}
            </div>
        </div>
    );
}

export default Results;