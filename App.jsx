// Meetup source code

import { useState} from "react"; //Calling React hooks

//Import local files
import './App.css'; 
import {auth} from './firebase'
import UserModule from './user'; const { useAuthstatus, Login, Signup, UserProfile } = UserModule;
import DatabaseModule from './database'; const {writeUserData,MeetingsList} = DatabaseModule;
import {signOut} from 'firebase/auth';

//main fucntion
function App() {
  const [page, setPage] = useState("main");
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [location, setlocation] = useState("");
  const {isLoggedin, currentUser, isLoading}=useAuthstatus();

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (currentUser) {
      writeUserData(
        title, 
        description, 
        location,
        currentUser.uid,          
      );
      settitle('');
      setdescription('');
      setlocation('');

    } else {
      alert("Error: You must be logged in to create a meeting.");
    }
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


  if (isLoading) { // Check loading state first
    return (
      <div className="App-container">
        <div className="main-box">
          <h1 className="Title">Loading...</h1>
          <p>Checking login status...</p>
        </div>
      </div>
    );
  }

  if (page === "main") {
    return (
      <div className="App-container main-page-container">

        {isLoggedin && currentUser && (
            <div className="user-status">
                <p>Logged in as: <strong>{currentUser.email}</strong></p>
                <button className="Button Logout-button" type="button" onClick={handleSignOut}>
                  Sign Out
                </button>

                <button className="Button" type="button" onClick={() => setPage("user_profile")}style={{ marginLeft: '10px' }}>
                  My Profile
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
  }else if(page === 'user_profile'){
    return <UserProfile setPage={setPage} />;
  }

}

export default App;