import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ScrumDetails = () => {
    const [scrums, setScrums] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null); // Initially null
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:4000/scrums")
            .then(resp => setScrums(resp.data))
            .catch(error => console.error("Error fetching scrums:", error));

        axios.get("http://localhost:4000/tasks")
            .then(resp => setTasks(resp.data))
            .catch(error => console.error("Error fetching tasks:", error));

        axios.get("http://localhost:4000/users")
            .then(resp => setUsers(resp.data))
            .catch(error => console.error("Error fetching users:", error));
    }, []);

    const handleScrumDetails = (scrum) => {
        setSelectedScrum(scrum); // Ensure scrum is set before rendering details
    };

    return (
        <div>
            <ul>
              
                <li><Link to="/profiles">Profiles</Link></li>
                <li><button onClick={() => navigate("/login")}>Logout</button></li>
            </ul>
            
            <h1>Scrum Teams</h1>
            {scrums.map(scrum => (
                <ul key={scrum.id}>
                    <li>
                        <p>
                            {scrum.name} 
                            <button onClick={() => handleScrumDetails(scrum)}>Get Details</button>
                        </p>
                    </li>
                </ul>
            ))}

            {/*  Show Scrum Team Details Below the List */}
            {selectedScrum && (
                <div >
                    <h2>Scrum Details for {selectedScrum?.name}</h2> {/* Safe optional chaining */}
                    
                    <h3>Tasks</h3>
                    {tasks.filter(task => task.scrumId === selectedScrum.id).length > 0 ? (
                        tasks.filter(task => task.scrumId === selectedScrum.id).map(task => (
                            <ul key={task.id}>
                                <li><strong>{task.title}:</strong> {task.description} - <em>{task.status}</em></li>
                            </ul>
                        ))
                    ) : (
                        <p>No tasks assigned to this Scrum Team.</p>
                    )}

                    <h3>Users</h3>
                    {users.filter(user => tasks.some(task => task.assignedTo === user.id && task.scrumId === selectedScrum.id)).length > 0 ? (
                        users
                            .filter(user => tasks.some(task => task.assignedTo === user.id && task.scrumId === selectedScrum.id))
                            .map(user => (
                                <ul key={user.id}>
                                    <li>{user.name} ({user.email})</li>
                                </ul>
                            ))
                    ) : (
                        <p>No users assigned to this Scrum Team.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ScrumDetails;
