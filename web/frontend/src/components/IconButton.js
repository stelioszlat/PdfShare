import React from 'react';

import styles from './components.module.css';


const IconButton = props => {

    const onClickHandler = event => {
        event.preventDefault();
        props.onClick();
    }

    return (
        <div className={styles['icon-button']}>
            <button onClick={onClickHandler}><img src={props.src} alt={props.alt} /></button>
        </div>
    );
}

export default IconButton;