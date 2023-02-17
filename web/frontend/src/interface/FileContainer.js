import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import './FileContainer.css';

import File from '../components/File';

// const FILES = [
//     {
//         name: "{file_name}.pdf",
//         lastUpdated: "{last update date}"
//     },
//     {
//         name: "{file_name}.pdf",
//         lastUpdated: "{last update date}"
//     }
// ]


const FileContainer = props => {
    // fetch files and list them as a grid of <File> components
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const showFiles = useSelector(state => state.showFiles);
    const editFile = useSelector(state => state.editFile);

    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchFiles();
    }, []);
    
    const fetchFiles = useCallback(async () => {
        const userId = localStorage.getItem('userId');
        await fetch("http://127.0.0.1:8080/api/metadata/files/user/" + userId, {
            method: "GET",
            header: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(response => {
            return response.json().then(data => {
                if (!data.files) {
                    setFiles([]);
                }
                setFiles(data.files);
            })
        }).catch(err => {
            console.log(err);
        })
    });

    const deleteFile = useCallback(async (fileId) => {
        await fetch('http://127.0.0.1:8080/api/metadata/file/' + fileId, {
            method: "DELETE",
            headers: {
                "Content-Type": 'appication/json'
            }
        }).then(response => {
            response.json().then(data => {
                const filteredFiles = files.filter(file => {return file._id !== fileId});
                setFiles([...filteredFiles]);
            })
        }).catch(err => {
            console.log(err);
        });
    });

    return (
        <>
            <div className="file-container">
                {isLoggedIn && showFiles && !editFile &&
                    files.map(file => {
                        return <File key={file._id} name={file.fileName} lastUpdated={file.updatedAt} onDelete={() => { deleteFile(file._id) }}/>
                    })
                }       
            </div>
        </>
    );
}

export default FileContainer;