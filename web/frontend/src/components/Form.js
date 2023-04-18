import React from 'react';

import styles from './components.module.css';

const Form = props => {

    return (
        <>
            <div className={styles['form-wrapper']}>
                <div className={styles['form-header']}> 
                    {props.title}
                </div>
                <div className={props.className}>
                    <form >
                        {props.children}
                    </form>
                </div>
            </div>
        </>
    );
}

export default Form;