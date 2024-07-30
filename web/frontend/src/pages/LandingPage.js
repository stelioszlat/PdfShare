import React from 'react';

import Header from '../interface/Header';
import TypicalLogo from '../components/TypicalLogo';
import { useSelector } from 'react-redux';
import SearchField from '../components/SearchField';

const LandingPage = props => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    return (
        <> 
            <Header />
            <div style="padding: 100px;">
                <TypicalLogo logo="PdfShare is a way of sharing pdf files"/>
                <SearchField/>
            </div>
        </>
    );
}

export default LandingPage;