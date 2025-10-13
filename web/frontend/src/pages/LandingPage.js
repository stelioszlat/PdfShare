import React from 'react';

import Button from '@mui/material/Button'
import Header from '../interface/Header';
import { Typewriter } from 'react-simple-typewriter'
import { useSelector } from 'react-redux';
import SearchField from '../components/SearchField';

const LandingPage = props => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    return (
        <> 
            <Header />
            <div className='container'>
                <h1 style={{size: 100}}>PdfShare</h1>
                <div style={{ fontSize: 20 }}> 
                    {!isLoggedIn && <Typewriter 
                        words={["PdfShare", 'is', 'a', 'new', 'way', 'of', 'sharing', 'pdf', 'files']}
                        loop={5}
                        cursor
                        cursorStyle="_"
                        typeSpeed={70}
                        deleteSpeed={50}
                        delaySpeed={1000}
                    />}
                </div>
                <div className='search-field'>
                    {!isLoggedIn && <SearchField/>}
                </div>
                <div>
                    <Button className='get-started' color="primary" name="Get Started"/>
                </div>
            </div>
        </>
    );
}

export default LandingPage;