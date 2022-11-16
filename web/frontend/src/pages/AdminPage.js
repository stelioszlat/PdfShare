import React from 'react';
import Button from '../components/Button';
import Header from '../interface/Header';
import AdminPanel from '../admin/AdminPanel';
import { useDispatch, useSelector } from 'react-redux';

const AdminPage = props => {
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const dispatch = useDispatch();

    return (
        <div>
            <div className="header">
                <label>PdfShare</label>
                {isLoggedIn && <div className="profile-buttons">
                    {/* <Button label="Sign Out" onClick={showLoginHandler}></Button> */}
                    {/* <IconButton src="user-avatar.png" alt="no_pic.png" /> */}
                </div>}
            </div>
            <AdminPanel />
        </div>
    );
}

export default AdminPage;