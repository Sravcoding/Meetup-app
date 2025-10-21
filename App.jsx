// Meetup source code

import { useState, useEffect } from "react"; //Calling React hooks
import { initializeApp } from 'firebase/app'; //Initializing firebase import
import { getDatabase, ref, set, push, onValue} from 'firebase/database'; //Calling firebase functions
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from 'firebase/auth';
import './App.css'; 
import config from './config';


//get database
const app = initializeApp(config);
export const db = getDatabase(app); 
export const auth=getAuth(app);

//Simple js fucntion to write data
function writeUserData(Title, Description, Location) {
  const meetref = ref(db, "Meetings"); 
  const pushref = push(meetref);
  set(pushref, {
    title: Title,
    description: Description,
    location: Location
  });
}

//Custom hook to read data. Needs hook so we can use hooks inside it cause of react rule
const useMeetingsData = () => {
    const [meetings, setMeetings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const meetingsRef = ref(db, 'Meetings');

        const unsubscribe = onValue(meetingsRef, (snapshot) => {
            const data = snapshot.val();
            const loadedMeetings = [];

            if (data) {
                for (const key in data) {
                    loadedMeetings.push({
                        id: key,
                        ...data[key]
                    });
                }
            }
            setMeetings(loadedMeetings.reverse()); 
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);//Note empty dependency array

    return { meetings, isLoading };
}

const MeetingsList = ({ setPage }) => {
    const { meetings, isLoading } = useMeetingsData();

    return (
        <div className="App-container">
            <div className="Main-content List-content">
                <h1 className="Title">Upcoming Meetups ({meetings.length})</h1>

                <div className="Meetings-list-wrapper">
                    {isLoading ? (
                        <p>Loading meetups...</p>
                    ) : meetings.length === 0 ? (
                        <p>No meetups created yet. Be the first! 🚀</p>
                    ) : (
                        meetings.map(meeting => (
                            <div key={meeting.id} className="Meeting-item">
                                <h3>{meeting.title}</h3>
                                <p><strong>📍 Location:</strong> {meeting.location}</p>
                                <p>{meeting.description}</p>
                            </div>
                        ))
                    )}
                </div>

                <button className="Button Back-button" type="button" onClick={() => setPage("main")}>
                &larr; Go Back
                </button>

            </div>

        </div>
    );
}



//signup function
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