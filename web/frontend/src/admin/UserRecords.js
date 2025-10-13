import React, { useCallback, useEffect, useState } from 'react';

import styles from './admin.module.css';

import { getUsers, deleteUser, updateUser } from '../services/user-service';

import Button from '../components/Button';
import IconButton from '../components/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
const UserRecords = props => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = useCallback(async () => {
        await getUsers()
        .then(response => {
            response.json().then(data => {
                if (!data.users) {
                    return setUsers([]);
                }
                data.users.sort((a, b) => { return a.username.localeCompare(b.username) });
                setUsers(data.users);
            }).catch(err => {
                console.log(err);
            })
        })
    })

    const showEditUserHandler = (event, userId) => {
        props.onEdit(userId);
    }

    const deleteUserHandler = useCallback(async (userId) => {
        await deleteUser(userId)
        .then(response => {
            response.json().then(data => {
                const userIndex = users.findindex(user => { return user._id === userId});
                users.splice(userIndex, 1);
                setUsers([...users]);
            })
        }).catch(err => {
            console.log(err);
        })
    })

    const toggleUserActivation = useCallback(async (userId, active) => {
        await updateUser({ active: active }, userId)
        .then(response => {
            response.json().then(data => {
                const activatedUser = users.find(user => {return user._id === userId});
                activatedUser.isActive = active;
                const filteredUsers = users.filter(user => {return user._id !== userId});
                setUsers([...filteredUsers, activatedUser].sort((a, b) => { return a.username.localeCompare(b.username) }));
            })
        }).catch(err => {
            console.log(err);
        })
    })

    return (
        <div className={styles['user-records']}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Admin</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Last Login</TableCell>
                            <TableCell>Joined</TableCell>
                            <TableCell>Last Modified</TableCell>
                            <TableCell>Active</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => {
                            return <TableRow key={user._id}>
                                <TableCell>{user.isAdmin ? <b>Yes</b> : "No"}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never" }</TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                                <TableCell>{new Date(user.updatedAt).toLocaleString()}</TableCell>
                                <TableCell>{user.isActive ? <b>Yes</b> : 'No'}</TableCell>
                                {/* {user.isActive && <TableCell><Button label="Deactivate" onClick={() => toggleUserActivation(user._id, false)}/></TableCell>} */}
                                {/* {!user.isActive && <TableCell><Button label="Activate" onClick={() => toggleUserActivation(user._id, true)}/></TableCell>} */}
                                <TableCell><EditIcon onClick={() => showEditUserHandler(user._id)}/></TableCell>
                                <TableCell><DeleteIcon onClick={() => deleteUserHandler(user._id)}/></TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default UserRecords;