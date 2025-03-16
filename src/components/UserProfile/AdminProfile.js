import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
const AdminProfile = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    const [userform, setUserForm] = useState(false)

    const [users, setUsers] = useState([]);
    const [Name, setName] = useState('');
    const [Password, setPassword] = useState('');
    const [Email, setEmail] = useState('');
    const [Role, setRole] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [tasks, setTasks] = useState([]);

    const handleCreate = () => {
         if (!Name || !Email || !Password || !Role) {
            setErrorMessage("All fields are required.");
            return;
        }
        setErrorMessage("");

        const payload = {
            name: Name,
            email: Email,
            password: Password,
            role: Role
        }

        axios.post("http://localhost:4000/users", payload)
            .then(resp => {

            }
            );

    }


    useEffect(() => {
        axios.get("http://localhost:4000/users").then(resp =>
            setUsers(resp.data)
        );



    }, [user, navigate])

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const AddUserForm = () => {
        setUserForm(true);
    }

    const GetHistory = (userId) => {
        axios.get("http://localhost:4000/tasks")
            .then(resp => {
                const filteredTasks = resp.data.filter(task => task.assignedTo === userId);
                setTasks(filteredTasks);
            })
            .catch(error => console.error("Error fetching tasks:", error));
    };

    return (
        <div>
            <ul>

                <li> <Link to="/admin-profile">Profiles</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
            
            <h2>User Profiles</h2>
            
            {!userform && (
                <button onClick={() => AddUserForm()}>Add New User</button>
            )}

            {
                userform && (
                    <div>
                        <button onClick={() => setUserForm(false)}>Cancel</button>
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                        <p><label>Name:</label>
                            <input type="text" name='Name' value={Name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </p>
                        <p>
                            <label>Email:</label>
                            <input type="text" name='Email' value={Email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </p>
                        <p>
                            <label>Password:</label>
                            <input type="password" name='Password' value={Password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </p>
                        <p>
                            <label>Role:</label>
                            <select value={Role} onChange={(e) => setRole(e.target.value)}>
                                <option value="Admin">Admin</option>
                                <option value="Employee">Employee</option>
                            </select>
                        </p>

                        <button onClick={handleCreate}>Create User</button>
                    </div>
                )
            }


            {
                users.map(user => (
                    <ul>
                        <li>
                            <p><b>Name:</b>{user.name}</p>
                            <p><b>Email:</b>{user.email}</p>
                            <p><button onClick={() => GetHistory(user.id)}>Get History</button></p>
                        </li>
                    </ul>
                ))
            }


            {tasks.map(task => {
                const assignedUser = users.find(user => user.id === task.assignedTo);
                return (
                    <><h3>Tasks Worked By  {assignedUser ? assignedUser.name : "Unknown"}</h3>
                        <ul>
                            <li key={task.id}>
                                <strong>Title:</strong> {task.title} <br />
                                <strong>Description:</strong> {task.description} <br />
                                <strong>Status:</strong> {task.status} <br />

                            </li>
                        </ul>
                    </>
                );
            })}



        </div>
    );
};

export default AdminProfile;
