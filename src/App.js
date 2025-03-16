import { React, useState, useEffect,createContext,useContext } from 'react';
import axios from 'axios';
import { BrowserRouter,Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login/Login';
import SignUp from './components/Signup/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import ScrumDetails from './components/Scrum Details/ScrumDetails';
import UserProfile from './components/UserProfile/UserProfile';
// import GetDetails from './components/Scrum Details/GetDetail';
import { UserProvider, useUser } from './context/UserContext';
import AdminPage from './components/Scrum Details/AdminPage';
import AdminProfile from './components/UserProfile/AdminProfile';
const App = () => {
 
  return (
    
    <UserProvider>
      <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path='/login' element={<Login/>}/>    
        <Route path='/profiles' element={<UserProfile />} />

        <Route path='/scrum' element={<ScrumDetails />} />
        
        <Route path="/signup" element={<SignUp />} />

        <Route path='/admin-page' element={<AdminPage/>}/>
        <Route path='/admin-profile' element={<AdminProfile/>}/>
      </Routes>
      </BrowserRouter>
    </UserProvider>
    
  );
};

const Nav = () => {
  const{user,logout}=useUser();
  console.log("Current User in Nav:", user); // Debugging output
  // const [showLogin, setShowLogin] = useState(false);
  // const [scrums, setScrums] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  // useEffect(() => {
  //   axios.get("http://localhost:4000/scrums").then(resp =>
  //     setScrums(resp.data)
  //   );
  // }, [])
  return (
    <nav>
      
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        {user ? (
          <>
            <li><Link to='/profiles'>Profiles</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default App;