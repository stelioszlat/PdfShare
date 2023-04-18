import React from 'react';
import { useDispatch } from 'react-redux';

import styles from './components.module.css';
import IconButton from './IconButton';

const File = props => {
    const dispatch = useDispatch();

    const editHandler = event => {
        dispatch({ type: 'edit-file' });
    }

    const deleteFileHandler = event => {
        props.onDelete();
    }

    const downloadFileHandler = event => {
        fetch('http://127.0.0.1:8070/api/download?file=' + props.name, {
			method: 'GET', 
		}).then(result => {
            result.blob();
        }).then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', props.name);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
		}).catch(err => {
			console.log(err);
		});
    }

    return (
        <div className="file-wrapper" >
            <div className={styles['file-header']}>
                <IconButton name="pdf" src="iwwa_file-pdf.png" onClick={downloadFileHandler}/>
            </div>
            <div className={styles['file-minified']}>
                <IconButton name="pic" src="no_pic.png" />
            </div>
            <div className={styles['file-footer']}>
                <div className={styles['file-details']}>
                    <p className={styles['file-name']}>{ props.name }</p>
                    <p>Last updated: { new Date(props.lastUpdated).toLocaleDateString() }</p>
                </div>
                <div className={styles['file-control']}>
                    <IconButton name="edit" src="ci_edit.png" onClick={editHandler} />
                    <IconButton name="delete" src="icomoon-free_bin.png" onClick={deleteFileHandler} />
                </div>
            </div>
        </div>
    )
}


export default File;