// Meetup source code

import { useState, useEffect } from "react"; //Calling React hooks
import { initializeApp } from 'firebase/app'; //Initializing firebase import
import { getDatabase, ref, set, push, onValue} from 'firebase/database'; //Calling firebase functions
import './App.css'; 
import config from './config'


//get database
const app = initializeApp(config);
export const db = getDatabase(app); 

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

                <button className="Button Back-button" type="button" onClick={() => setPage("login")}>
                &larr; Go Back
                </button>

            </div>

        </div>
    );
}

//main fucntion
function App() {
  const [page, setPage] = useState("login");
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [location, setlocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); 
    writeUserData(title, description, location);
    settitle('');
    setdescription('');
    setlocation('');
  };

  if (page === "login") {
    return (
      <div className="App-container">
        <div className="Login-box">
          <h1 className="Title">Welcome to Meetup! 🥳</h1>
          <button className="Button" type="button" onClick={() => setPage("create_meetings")}>
            Create a Meeting
          </button>

          <button className="Button" type="button" onClick={() => setPage("list_of_meetings")}>
            See all Meetings
          </button>

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

          <button className="Button Back-button" type="button" onClick={() => setPage("login")}>
            &larr; Go Back
          </button>
        </div>
      </div>
    );

  }else if(page === 'list_of_meetings'){
    return <MeetingsList setPage={setPage} />;
  }

}

export default App;