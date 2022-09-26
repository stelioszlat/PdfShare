import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

import './NewFileForm.css';

import Form from '../components/Form';
import Button from '../components/Button';

const NewFileForm = props => {
	const isLoggedIn = useSelector(state => state.isLoggedIn);
	const showNewFileForm = useSelector(state => state.showNewFileForm);

	const onClickHandler = event => {

		// send file
		fetch('http://127.0.0.1:8082/api/extracting/file', {
			method: 'POST',
			headers: {

			}
		}).then(result => {
			return result;
		}).catch(err => {

		});
	}

    return (
		<>
			{isLoggedIn && showNewFileForm &&
				<Form className="newfile-form" title="Create">
            		<input type="file" name="file"/><br/>
					<Button label="Upload File" onClick={onClickHandler} />
				</Form>
			}		
		</>
	);
}

export default NewFileForm;