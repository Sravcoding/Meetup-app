// Meetup source code

import { useState, useEffect } from "react"; //Calling React hooks
import { initializeApp } from 'firebase/app'; //Firebase imports
import { getDatabase} from 'firebase/database';
import {getAuth,signOut} from 'firebase/auth';

//Import local files
import './App.css'; 
import config from './config';
import UserModule from './user'; const { useAuthstatus, Login, Signup } = UserModule;
import DatabaseModule from './database'; const {writeUserData,MeetingsList} = DatabaseModule;

//initializing firebase and setting up db and auth
const app = initializeApp(config);
export const db = getDatabase(app); 
export const auth=getAuth(app);



//main fucntion
function App() {
  const [page, setPage] = useState("main");
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [location, setlocation] = useState("");
  const {isLoggedin, currentUser}=useAuthstatus();

  const handleSubmit = (e) => {
    e.preventDefault(); 
    writeUserData(title, description, location);
    settitle('');
    setdescription('');
    setlocation('');
  };

  const handleSignOut = async () => {
      try {
          await signOut(auth);
          setPage("main"); 
          console.log("User signed out successfully.");
      } catch (error) {
          console.error("Sign out error:", error);
          alert("Failed to sign out. Please try again.");
      }
};

  if (page === "main") {
    return (
      <div className="App-container main-page-container">

        {isLoggedin && currentUser && (
            <div className="user-status">
                <p>Logged in as: <strong>{currentUser.email}</strong></p>
                <button 
                  className="Button Logout-button" 
                  type="button" 
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
            </div>
        )}

        <div className="main-box">
          <h1 className="Title">Welcome to Meetup! 🥳</h1>

          {isLoggedin &&(
          <>  
            <button className="Button" type="button" onClick={() => setPage("create_meetings")}>
              Create a Meeting
            </button>
          </>
          )}  

          <button className="Button" type="button" onClick={() => setPage("list_of_meetings")}>
            See all Meetings
          </button>
          

         {!isLoggedin && (
            <>
              <button className="Button" type="button" onClick={() => setPage("sign_up")}>
                Sign-Up
              </button>
              <button className="Button Submit-button" type="button" onClick={() => setPage("login")}>
                Log In
              </button>
            </>
          )}

        </div>
      </div>
    );

  } else if (page === "create_meetings") {
    return (
      <div className="App-container">
        <div className="Main-content">
          <h1 className="Title">Create a New Meetup</h1>       
          <form className="Meetup-form" onSubmit={handleSubmit}>
            <input 
              className="Input-field"
              placeholder="Enter Title" 
              type="text" 
              value={title} 
              onChange={(e) => settitle(e.target.value)}
              required
            />

            <textarea 
              className="Input-field"
              placeholder="Enter Description" 
              rows="7"
              type="text" 
              value={description} 
              onChange={(e) => setdescription(e.target.value)}
              required
            />

            <input 
              className="Input-field"
              placeholder="Enter Location" 
              type="text" 
              value={location} 
              onChange={(e) => setlocation(e.target.value)}
              required
            />

            <input className="Button Submit-button" type="submit" value="Create Meetup" />
          </form>

          <button className="Button Back-button" type="button" onClick={() => setPage("main")}>
            &larr; Go Back
          </button>
        </div>
      </div>
    );

  }else if(page === 'list_of_meetings'){
    return <MeetingsList setPage={setPage} />;
  }else if(page === 'sign_up'){
    return <Signup setPage={setPage} />;
  }else if(page === 'login'){
    return <Login setPage={setPage} />;
  }

}

export default App;