import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

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
  const [error, setError] = useState('');

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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/bookings');
        setBookings(response.data);
      } catch (error) {
        setError('Failed to fetch bookings');
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
    if (!selectedRoom || !selectedDate || !startTime || !endTime || !pic || !meetingName) {
      setError('Please fill in all required fields');
      return;
    }

    if (startTime >= endTime) {
      setError('End time must be after start time');
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
      const response = await axios.post('/api/bookings', newBooking);
      setBookings((prev) => [...prev, response.data]);
      setShowSuccess(true);
      setError('');
      setTimeout(() => setShowSuccess(false), 3000);

      // Reset form
      setSelectedRoom('');
      setSelectedDate('');
      setStartTime('');
      setEndTime('');
      setPic('');
      setMeetingName('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to book room');
    }
  };

  const handleDeleteBooking = async (index) => {
    try {
      await axios.delete(`/api/bookings/${index}`);
      setBookings((prev) => prev.filter((_, i) => i !== index));
      setError('');
    } catch (error) {
      setError('Failed to delete booking');
      console.error('Error deleting booking:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meeting Room Booking</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {showSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-600">Booking successful!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Name
              </label>
              <input
                type="text"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter meeting name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Person in Charge
              </label>
              <input
                type="text"
                value={pic}
                onChange={(e) => setPic(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select a room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option
                      key={time}
                      value={time}
                      disabled={!isTimeSlotAvailable(selectedRoom, selectedDate, time)}
                    >
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((time) => (
                    <option
                      key={time}
                      value={time}
                      disabled={time <= startTime}
                    >
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleBooking}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Book Room
            </button>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Room Availability</h2>
            {selectedRoom && selectedDate ? (
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map(({ time, available }) => (
                  <div
                    key={time}
                    className={`p-2 text-center text-sm rounded ${
                      available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {time}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Select a room and date to view availability</p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Current Bookings</h2>
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-md"
              >
                <div>
                  <h3 className="font-medium">{booking.meetingName}</h3>
                  <p className="text-sm text-gray-600">
                    {rooms.find((r) => r.id === booking.room)?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.date} | {booking.startTime} - {booking.endTime}
                  </p>
                  <p className="text-sm text-gray-600">PIC: {booking.pic}</p>
                </div>
                <button
                  onClick={() => handleDeleteBooking(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-gray-500 text-center py-4">No bookings yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
