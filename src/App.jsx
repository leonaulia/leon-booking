import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [bookings, setBookings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [pic, setPic] = useState('');
  const [meetingName, setMeetingName] = useState('');

  const API_URL = '/api/bookings'; // Adjust this if your backend has a different base URL

  const rooms = [
    { id: 'zoom', name: 'Zoom Room' },
    { id: 'room1', name: 'Meeting Room 1' },
    { id: 'room2', name: 'Meeting Room 2' },
  ];

  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const isTimeSlotAvailable = (room, date, slotTime) => {
    return !bookings.some(
      (booking) =>
        booking.room === room &&
        booking.date === date &&
        slotTime >= booking.startTime &&
        slotTime < booking.endTime
    );
  };

  // Fetch bookings from the backend
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(API_URL);
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    if (selectedRoom && selectedDate) {
      const slots = timeSlots.map((time) => ({
        time,
        available: isTimeSlotAvailable(selectedRoom, selectedDate, time),
      }));
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedRoom, selectedDate, bookings]);

  const handleBooking = async () => {
    if (!selectedRoom || !selectedDate || !startTime || !endTime) {
      return;
    }

    if (startTime >= endTime) {
      alert('End time must be after start time');
      return;
    }

    const newBooking = {
      room: selectedRoom,
      date: selectedDate,
      startTime,
      endTime,
      pic,
      meetingName,
    };

    try {
      const response = await axios.post(API_URL, newBooking);
      setBookings((prev) => [...prev, response.data]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Reset form
      setSelectedRoom('');
      setStartTime('');
      setEndTime('');
      setPic('');
      setMeetingName('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to book room.');
    }
  };

  const handleDeleteBooking = async (index) => {
    try {
      const bookingToDelete = bookings[index];
      await axios.delete(`${API_URL}/${index}`);
      setBookings((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Meeting Room Booking</h1>

        {/* Form Inputs */}
        {/* Same JSX as before for inputs, availability display, and booking list */}
        {/* Make sure to call handleBooking() for booking and handleDeleteBooking(index) for deletion */}
      </div>
    </div>
  );
}

export default App;
