import { useState, useEffect } from "react";
import {auth, db } from './firebase';
import { ref, set, push, onValue} from 'firebase/database';



function writeUserData(Title, Description, Location, userId, date) {
  const meetref = ref(db, "Meetings"); 
  const pushref = push(meetref);
  set(pushref, {
    title: Title,
    description: Description,
    location: Location,
    authorId: userId,  
    date: date
  });
}

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
    }, []);

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
                                <p>{meeting.authorId}</p>
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

export default {writeUserData,MeetingsList};