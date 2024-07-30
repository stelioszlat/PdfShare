import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './components.module.css';

import SearchResult from './SearchResult';
import { filesActions } from '../store/files';
import { useNavigate } from 'react-router-dom';

const SearchField = props => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const debounce = setTimeout(() => {
            if (query !== '') {
                searchHandler();
            }
        }, 800);
    
        return () => clearTimeout(debounce);
      }, [query]);

    const searchFocusHandler = event => {
        setShowResults(false);
        dispatch(filesActions.searchFocus());
    }

    const searchHandler = event => {
        fetch('http://127.0.0.1:8080/api/search?query=' + query, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(result => {
            result.json().then(response => {
                console.log(response);
                setSearchResults(response.files);
                setShowResults(true);
            })
        }).catch(err => {
            console.log(err);
        })
    }

    const changeInputHandler = event => {
        setShowResults(false);
        setQuery(event.target.value);
    }

    const resultClickHandler = useCallback((event, id) => {
        navigate('/file/' + id);
    });

    const resultsClickHandler = (event) => {
        dispatch(filesActions.searchResults({ searchResults: searchResults}));
        navigate('/results?query=' + query);
    }

    return (
        <>
            <div className={styles['search-wrapper']}> 
                <div className={styles['search-field']}>
                    <div><input value={query} type="" placeholder="Search anything..." onChange={changeInputHandler} onFocus={searchFocusHandler}/></div>
                    {showResults && searchResults.length != 0 && <div className={styles['file-results']}>
                        {searchResults.slice(0, 5).map(result => {
                            return <SearchResult key={result._id} file={result} clickFileCallback={(event) => resultClickHandler(event, result._id)} clickUploaderCallback={resultClickHandler} />
                        })}
                        <div className={styles['show-all-wrapper']}>
                            {searchResults.length > 5 && <button onClick={resultsClickHandler}>Show All</button>}
                        </div>
                    </div>}
                </div>
            </div>
        </>
    );
};

export default SearchField;