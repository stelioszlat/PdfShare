import React from 'react';

import './AdminPanel.css';

import UserRecord from './UserRecord';

const AdminPanel = (props) => {

    return (
        <div className="admin-panel">
            <div className="side-menu">
                <ul>
                    <li><a>General</a></li>
                    <li><a>Users</a></li>
                </ul>
            </div>
            <div className="main-panel">
                <div className="table-labels">
                    <UserRecord />
                </div>
                <div className="user-records">
                    <UserRecord />    
                </div> 
            </div>
        </div>
    );
}

export default AdminPanel;