import React, { useState } from 'react';

import styles from './forms.module.css';

import Form from '../components/Form';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const NewFileForm = props => {
	const navigate = useNavigate();
	const [fileName, setFileName] = useState('');
	const [message, setMessage] = useState('');

	const [file, setFile] = useState(null);

	const onClickHandler = event => {
		console.log(file);
		const formData = new FormData();
		formData.append('file', file);
		fetch('http://127.0.0.1:8070/api/extract/file', {
			method: 'POST', 
			body: formData
		}).then(result => {
			console.log(result);
			result.json().then(response => {
				setFileName(response.fileName);
				setMessage(response.message);
			})
			navigate('/home');
		}).catch(err => {
			console.log(err);
			setMessage('Could not upload the file');
		});
	}

	const selectFileHandler = event => {
		console.log(event.target);
		if (event.target.files || event.target.files.length === 1) {
			const selectedFile = event.target.files[0];
			setFile(selectedFile);
			setFileName(selectedFile.name);
		}
		console.log(event.target.files);
    }

    return (
		<>
			<Form className={styles['newfile-form']} title="Create">
				<div className={styles['main-selector']}>
					<label htmlFor="file-upload">
						Select File
						<input id="file-upload" type="file" name="file" accept=".pdf" onChange={selectFileHandler}/>
					</label>
				</div>
				<div className={styles['file-preview']}>{fileName}</div>
				<Button label="Upload File" onClick={onClickHandler} />
				<p className={styles['validation-message']}>{message}</p>
			</Form>	
		</>
	);
}

export default NewFileForm;