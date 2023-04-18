import React from 'react';
import Header from '../interface/Header';
import AdminPanel from '../admin/AdminPanel';

const AdminPage = props => {

    return (
        <div>
            <Header />
            <AdminPanel />
        </div>
    );
}

export default AdminPage;