import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const[name,setName]=useState('');
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const [error, setError] = useState("");

    const navigate=useNavigate();

    const handleSignUp = ({onClose}) => {
        if (!email.includes("@")) {
            setError("Please include an '@'");
            return;
        }
        if (!email || !password) {
            setError("Both fields are required");
            return;
        }
        onClose(); // Switch back to login form after sign-up
    };


    return (
        <div className="p-6 text-center">
          <h1>Sign Up</h1>
          <p>
              
                <label>Name</label>
                <input
                    type="text" name='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label>Email</label>
                <input
                    type="email" name='email'
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
            <button onClick={handleSignUp}>Sign Up</button>
            </p>
        </div>
      );
};

export default SignUp;
