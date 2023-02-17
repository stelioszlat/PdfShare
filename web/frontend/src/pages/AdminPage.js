import React from 'react';
import Button from '../components/Button';
import Header from '../interface/Header';
import AdminPanel from '../admin/AdminPanel';
import { useDispatch, useSelector } from 'react-redux';

const AdminPage = props => {

    return (
        <div>
            <Header />
            <AdminPanel />
        </div>
    );
}

export default AdminPage;