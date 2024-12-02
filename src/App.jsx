import React, { useState } from 'react';

function App() {
  const [bookings, setBookings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const rooms = [
    { id: 'zoom', name: 'Zoom Room' },
    { id: 'room1', name: 'Meeting Room 1' },
    { id: 'room2', name: 'Meeting Room 2' },
  ];

  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8; // Starting from 8 AM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const handleBooking = () => {
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
    };

    setBookings([...bookings, newBooking]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset form
    setSelectedRoom('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Meeting Room Booking</h1>
        
        {/* Room Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Room</label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Choose a room</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Date</label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Time Selection */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Time</label>
            <select
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select start time</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Time</label>
            <select
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select end time</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBooking}
          disabled={!selectedRoom || !selectedDate || !startTime || !endTime}
          className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
        >
          Book Room
        </button>

        {/* Success Message */}
        {showSuccess && (
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
            Room booked successfully!
          </div>
        )}

        {/* Current Bookings */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Current Bookings</h2>
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <div key={index} className="border rounded p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      {rooms.find(r => r.id === booking.room)?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking.date}
                    </p>
                  </div>
                  <div className="text-sm">
                    {booking.startTime} - {booking.endTime}
                  </div>
                </div>
              </div>
            ))}
            {bookings.length === 0 && (
              <p className="text-gray-500 text-center">No bookings yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
