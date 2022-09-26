import React from 'react';
import Typical from 'react-typical';


const TypicalLogo = props => {

    return (
        <Typical 
            steps={[props.logo, 5000, ""]}
            loop={Infinity}
            wrapper="h1"
            colo
        />
    );
}

export default TypicalLogo;
