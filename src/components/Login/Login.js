import React, { useContext, useEffect } from 'react';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignUp from '../Signup/SignUp';


function Login() {
    
    const[users,setUsers]=useState([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showSignUp, setShowSignUp] = useState(false); // State to toggle SignUp form
   
    const navigate = useNavigate();

    useEffect(()=>{
        axios.get("http://localhost:4000/users").then(resp=>
            setUsers(resp.data)
        );
    },[])
    const handleLogin = () => {
        if (!email.includes("@")) {
            setError("Please include an '@'");
            return;
        }
        if (!email || !password) {
            setError("Both fields are required");
            return;
        }
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userRole", user.role); // Store role in localStorage
            localStorage.setItem("userEmail", user.email); // Store user email
            setError(""); // Clear error message
            
            // Redirect based on role
            if (user.role === "admin") {
                navigate('/admin-page'); // Redirect Admin to Admin Dashboard
            } else if (user.role === "employee") {
                navigate('/scrum'); // Redirect Employee to Scrum Page
            } else {
                setError("Invalid role assigned"); // Handle unexpected role
            }
        } else {
            setError("Invalid email or password");
        }
    };
    
    
    return (
        <div>
            {showSignUp ? (
                // Show SignUp form instead of Login
                <SignUp onClose={() => setShowSignUp(false)} />
            ) : (
                // Show Login form
                <div>
                    <h1>Login</h1>
                    <p>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    
                    {error && <p className="text-red-500">{error}</p>}
                    <button onClick={handleLogin}>Login</button>
                    </p>
                    <p>
                        
                        <button onClick={() => setShowSignUp(true)}>Sign Up</button>
                    </p>
                </div>
            )}
        </div>
    );
};

export default Login;
