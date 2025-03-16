import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
const UserProfile = () => {
    const {  logout } = useUser();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:4000/tasks").then(resp => setTasks(resp.data));
        axios.get("http://localhost:4000/users").then(resp => setUsers(resp.data)); // Fetch users
    }, []);


    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div>
            <ul>

                <li> <Link to="/profiles">Profiles</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
            <h2>User Profiles</h2>
            <div>
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
        </div>
    );
};

export default UserProfile;
