import React, { useState, useEffect } from 'react';
import mongoose from 'mongoose';

mongoose.connect('process.env.MONGO_URL', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const User = mongoose.model('User', {
  _id: String,
  notification_id: String,
  flight_id: [{ type: String, ref: 'Flight' }],
  message: String,
  timestamp: String,
  method: String,
  recepient: String,
});

const Flight = mongoose.model('flight_dtls', {
  _id: String,
  flight_id: String,
  airline: String,
  status: String,
  departure_gate: String,
  arrival_gate: String,
  scheduled_departure: String,
  scheduled_arrival: String,
  actual_departure: null,
  actual_arrival: null
});

function App() {
  const [user, setUser] = useState({});
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        console.log('Fetching user data...');
        const userDoc = await User.findOne({ _id: '66a60bce39543ec9f1b05fb9' });
        console.log('User document:', userDoc);
        setUser(userDoc);
      } catch (error) {
        console.log('Error fetching user data:', error);
        setError(error);
      }
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    async function fetchFlightData() {
      if (user.flights) {
        try {
          console.log('Fetching flight data...');
          const flightsDocs = await Flight.find({ _id: { $in: user.flights } });
          console.log('Flight documents:', flightsDocs);
          setFlights(flightsDocs);
        } catch (error) {
          console.log('Error fetching flight data:', error);
          setError(error);
        }
      }
    }
    fetchFlightData();
  }, [user]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log('Rendering App component...');
  return (
    <div>
      <h1>Flight Status</h1>
      {flights.map(flight => (
        <div key={flight._id}>
          <h2>{flight.flight_id}</h2>
          <p>Airline: {flight.airline}</p>
          <p>Status: {flight.status}</p>
          <p>Departure Gate: {flight.departure_gate}</p>
          <p>Arrival Gate: {flight.arrival_gate}</p>
          <p>Scheduled Departure: {flight.scheduled_departure}</p>
          <p>Scheduled Arrival: {flight.scheduled_arrival}</p>
        </div>
      ))}
    </div>
  );
}

export default App;