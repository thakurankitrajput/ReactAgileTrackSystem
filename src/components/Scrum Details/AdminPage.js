import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminPage = () => {
    const [scrums, setScrums] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedScrum, setSelectedScrum] = useState(null); // Initially null
    const [scrumform, setScrumForm] = useState(false);
    const navigate = useNavigate();

    const [scrumName, setScrumName] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [assignTo, setAssignTo] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleCreate = () => {
        
        if (!scrumName || !title || !description || !status || !assignTo) {
            setErrorMessage("All fields are required.");
            return;
        }
        setErrorMessage("");

        const payload = {
            name: scrumName,
            title: title,
            description: description,
            status: status,
            assignedTo: assignTo
        }

        axios.post("http://localhost:4000/tasks", payload)
            .then(resp => {
                
            }
            );

    }

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

    const AddScrumForm = () => {
        setScrumForm(true);
    }
  
    const handleStatusChange = (taskId, newStatus) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, status: newStatus } : task
            )
        )};  

    return (
        <div>
            <ul>

                <li><Link to="/admin-profile">Profiles</Link></li>
                <li><button onClick={() => navigate("/login")}>Logout</button></li>
            </ul>

            <h1>Scrum Teams</h1>
            {!scrumform && (
                <button onClick={() => AddScrumForm()}>Add New Scrum</button>
            )}

            {
                scrumform && (
                    <div>
                        <button onClick={() => setScrumForm(false)}>Cancel</button>
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                        <p><label>Scrum Name:</label>
                            <input type="text" name='scrumName' value={scrumName}
                                onChange={(e) => setScrumName(e.target.value)}
                            />
                        </p>
                        <p>
                            <label>Task Title:</label>
                            <input type="text" name='title' value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </p>
                        <p>
                            <label>Task Description:</label>
                            <input type="text" name='description' value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </p>
                        <p>
                            <label>Task Status:</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </p>
                        <p>
                            <label>Assigned To:</label>
                            <select value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
                                <option>Select a user</option> {/* Default */}
                                <option value="Admin">Admin</option>
                                <option value="Employee">Employee</option>
                            </select>
                        </p>

                        <button onClick={handleCreate}>Create Scrum</button>
                    </div>
                )
            }


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
                                <li><strong>{task.title}:</strong> {task.description} - <em>{task.status}</em>
                                <select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)}>
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select></li>
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

export default AdminPage;
