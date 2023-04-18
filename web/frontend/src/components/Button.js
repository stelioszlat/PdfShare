import React, { useCallback } from 'react';

import styles from './components.module.css';

const Button = props => {

    const click = useCallback(() => {
        props.onClick();
    }, [props]);

    const onClickHandler = event => {
        event.preventDefault();
        click();
    };

    return (
        <button className={styles['main-button']} onClick={onClickHandler}>{props.label}</button>
    );
}

export default Button;