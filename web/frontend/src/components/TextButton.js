import React, { useCallback } from 'react';

import styles from './components.module.css';

const TextButton = props => {

    const click = useCallback(() => {
        props.onClick();
    }, [props]);

    const onClickHandler = event => {
        event.preventDefault();
        click();
    };

    return (
        <button className={styles['text-button']} onClick={onClickHandler}>{props.label}</button>
    );
}

export default TextButton;