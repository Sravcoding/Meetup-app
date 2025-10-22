import { useState, useEffect } from "react";
import { auth } from './App';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';

function Signup({ setPage }) { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null); 
    
    try {
      if (email.split('@')[1] === 'students.iiests.ac.in'){
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log('User signed up:', userCredential.user);
        setPage("list_of_meetings");
      }else{
        throw Error("Only Accepting IIEST-S students.");
      }
    } catch (err) {
      console.error('Signup Error:', err.message);
      setError(err.message);
    }
  }
  
  return (
    <div className="App-container"> 
      <div className="Main-content"> 
        <h1 className="Title">Sign Up</h1> 
        <form onSubmit={handleSignup} className="Meetup-form">
          {error && <p style={{ color: 'red' }}>{error} Please try again</p>}
          <input 
            className="Input-field"
            placeholder="Enter EMAIL" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input 
            className="Input-field"
            placeholder="Enter Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <input className="Button Submit-button" type="submit" value="Sign Up" />
        </form>

        <button className="Button Back-button" type="button" onClick={() => setPage("main")}>
          &larr; Go Back
        </button>
      </div>
    </div>
  );
}

function Login({ setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Logged in successfully, navigate back to the main page
      console.log('User logged in!');
      setPage("main"); 
    } catch (err) {
      console.error('Login Error:', err.message);
      setError(err.message);
    }
  };

  return (
    <div className="App-container"> 
      <div className="Main-content"> 
        <h1 className="Title">Log In</h1> 
        <form onSubmit={handleLogin} className="Meetup-form">
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input 
            className="Input-field"
            placeholder="Enter EMAIL" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input 
            className="Input-field"
            placeholder="Enter Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <input className="Button Submit-button" type="submit" value="Log In" />
        </form>

        <button className="Button Back-button" type="button" onClick={() => setPage("main")}>
          &larr; Go Back
        </button>
      </div>
    </div>
  );
}

const useAuthstatus = () => {
  
  const [isLoggedin, setisLoggedin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setisLoggedin(true)
        setCurrentUser(user) 
      } else {
        setisLoggedin(false)
        setCurrentUser(null) 
      }
    });

    return () => unsubscribe();
  }, []);

  return {isLoggedin, currentUser}; 
}

export default {useAuthstatus,Login,Signup};