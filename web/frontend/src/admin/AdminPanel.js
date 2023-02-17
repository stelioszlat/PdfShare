import React, { useState } from 'react';

import './AdminPanel.css';
import TextButton from '../components/TextButton';

import UserRecords from './UserRecords';
import FileRecords from './FileRecords';
import Button from '../components/Button';
import UserEntryPanel from './UserEntryPanel';
import TokenRecords from './TokenRecords';
import LogsRecords from './LogsRecords';

const AdminPanel = (props) => {
    const [panel, setPanel] = useState('general');
    const [done, setDone] = useState(true);
    const [userEdited, setUserEdited] = useState(null);

    const switchPanelGeneral = event => {
        setPanel('general');
    }
    const switchPanelUsers = event => {
        setPanel('users');
        setDone(true);
    }
    const switchPanelFiles = event => {
        setPanel('files');
    }
    const switchPanelTokens = event => {
        setPanel('tokens');
    }
    const switchPanelLogs = event => {
        setPanel('logs');
    }

    const createNewUserHandler = event => {
        setDone(false);
        setPanel('newUser');
    }

    const editUserHandler = (event, user) => {
        setDone(false);
        setPanel('editUser');
        setUserEdited(user);
    }

    const doneHandler = event => {
        setDone(true);
    }

    return (
        <div className="admin-panel">
            <div className="side-menu">
                <TextButton onClick={switchPanelGeneral} label="General" />
                <TextButton onClick={switchPanelUsers} label="Users" />
                <TextButton onClick={switchPanelFiles} label="Files" />
                <TextButton onClick={switchPanelTokens} label="Tokens" />
                <TextButton onClick={switchPanelLogs} label="Logs" />
            </div>
            <div className="main-panel">
                {panel === 'general' && <div className='general'>
                    <h1>General</h1>
                </div>}
                {panel === 'users' && done && <>
                    <UserRecords onEdit={editUserHandler}/>
                    <Button label="Create User" onClick={createNewUserHandler}/>
                </>}
                {panel === 'newUser' && <>
                    {!done && <UserEntryPanel editMode={false} onDone={doneHandler}/>}
                </>}
                {panel === 'editUser' && <>
                    {!done && <UserEntryPanel editMode={true} userEdited={userEdited} onDone={doneHandler} />}
                </>}
                {panel === 'files' && <>
                    <FileRecords />
                </>}
                {panel === 'tokens' && <>
                    <TokenRecords />
                </>}
                {panel === 'logs' && <>
                    <LogsRecords />
                </>}
            </div>
        </div>
    );
}

export default AdminPanel;