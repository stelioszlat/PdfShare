import React from 'react';

import './Error.css';

const Error = props => {

    return (
        <div className="error">
            <p>{props.message}</p>
        </div>
    );
}

export default Error;