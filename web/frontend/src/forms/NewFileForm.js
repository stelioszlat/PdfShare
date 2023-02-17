import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './NewFileForm.css';

import Form from '../components/Form';
import Button from '../components/Button';

const NewFileForm = props => {
	const dispatch = useDispatch();
	const isLoggedIn = useSelector(state => state.isLoggedIn);
	const showNewFileForm = useSelector(state => state.showNewFileForm);
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
			// dispatch({ type: 'main' })
		}).catch(err => {
			console.log(err);
			setMessage('An error occurred while uploading the file');
		});
	}

	const selectFileHandler = event => {
		if (event.target.files || event.target.files.length === 1) {
			const selectedFile = event.target.files[0];
			setFile(selectedFile);
			console.log(selectedFile);
		}
		console.log(event.target.files);
    }

    return (
		<>
			{isLoggedIn && showNewFileForm &&
				<Form className="newfile-form" title="Create">
            		<div className="main-selector">
						<label htmlFor="file-upload">
							Select File
						</label>
						<input id="file-upload" type="file" name="file" accept=".pdf" onClick={selectFileHandler}/>
					</div>
					<p>{fileName}</p>
					<Button label="Upload File" onClick={onClickHandler} />
					<p className="validation-message">{message}</p>
				</Form>
			}		
		</>
	);
}

export default NewFileForm;