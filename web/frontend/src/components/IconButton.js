import React from 'react';

import './IconButton.css';


const IconButton = props => {

    const onClickHandler = event => {
        event.preventDefault();
        props.onClick();
    }

    return (
        <div className="icon-button">
            <button onClick={onClickHandler}><img src={props.src} alt={props.alt} /></button>
        </div>
    );
}

export default IconButton;