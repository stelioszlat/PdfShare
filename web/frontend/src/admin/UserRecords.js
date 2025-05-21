import React, { useCallback, useEffect, useState } from 'react';

import styles from './admin.module.css';

import { getUsers, deleteUser, updateUser } from '../services/user-service';

import Button from '../components/Button';
import IconButton from '../components/IconButton';
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
                activatedUser.active = active;
                const filteredUsers = users.filter(user => {return user._id !== userId});
                setUsers([...filteredUsers, activatedUser].sort((a, b) => { return a.username.localeCompare(b.username) }));
            })
        }).catch(err => {
            console.log(err);
        })
    })

    return (
        <div className={styles['user-records']}>
            <table>
                <thead>
                    <tr>
                        <th>Admin</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Last Login</th>
                        <th>Joined</th>
                        <th>Last Modified</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => {
                        return <tr key={user._id}>
                            <td>{user.isAdmin ? <b>Yes</b> : "No"}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never" }</td>
                            <td>{new Date(user.createdAt).toLocaleString()}</td>
                            <td>{new Date(user.updatedAt).toLocaleString()}</td>
                            {user.active && <td><Button label="Deactivate" onClick={() => toggleUserActivation(user._id, false)}/></td>}
                            {!user.active && <td><Button label="Activate" onClick={() => toggleUserActivation(user._id, true)}/></td>}
                            <td><IconButton src="ci_edit.png" onClick={() => showEditUserHandler(user._id)}/></td>
                            <td><IconButton src="icomoon-free_bin.png" onClick={() => deleteUserHandler(user._id)}/></td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default UserRecords;