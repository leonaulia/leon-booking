import React, { useState, useEffect } from 'react';

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

  const rooms = [
    { id: 'zoom', name: 'Zoom Room' },
    { id: 'room1', name: 'Meeting Room 1' },
    { id: 'room2', name: 'Meeting Room 2' },
  ];

  // Generate time slots from 8 AM to 8 PM
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Check if a time slot is available
  const isTimeSlotAvailable = (room, date, slotTime) => {
    return !bookings.some(booking => 
      booking.room === room &&
      booking.date === date &&
      slotTime >= booking.startTime &&
      slotTime < booking.endTime
    );
  };

  // Update available slots whenever room or date changes
  useEffect(() => {
    if (selectedRoom && selectedDate) {
      const slots = timeSlots.map(time => ({
        time,
        available: isTimeSlotAvailable(selectedRoom, selectedDate, time)
      }));
      setAvailableSlots(slots);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedRoom, selectedDate, bookings]);

  const handleBooking = () => {
    if (!selectedRoom || !selectedDate || !startTime || !endTime) {
      return;
    }

    if (startTime >= endTime) {
      alert('End time must be after start time');
      return;
    }

    // Check if the entire duration is available
    const startIndex = timeSlots.indexOf(startTime);
    const endIndex = timeSlots.indexOf(endTime);
    const duration = timeSlots.slice(startIndex, endIndex);
    
    const isAvailable = duration.every(time => 
      isTimeSlotAvailable(selectedRoom, selectedDate, time)
    );

    if (!isAvailable) {
      alert('Some of the selected time slots are not available');
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

    setBookings([...bookings, newBooking]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset form
    setSelectedRoom('');
    setStartTime('');
    setEndTime('');
    setPic('');
    setMeetingName('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Meeting Room Booking</h1>
        
        {/* Meeting Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Person in Charge (PIC)</label>
            <input
              type="text"
              value={pic}
              onChange={(e) => setPic(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter PIC name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Meeting Name</label>
            <input
              type="text"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter meeting name"
              required
            />
          </div>
        </div>

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

        {/* Availability Display */}
        {selectedRoom && selectedDate && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Availability</h3>
            <div className="grid grid-cols-4 gap-2">
              {availableSlots.map(({ time, available }) => (
                <div
                  key={time}
                  className={`p-2 rounded text-center text-sm ${
                    available 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>
        )}

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
              {availableSlots
                .filter(slot => slot.available)
                .map(slot => (
                  <option key={slot.time} value={slot.time}>
                    {slot.time}
                  </option>
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
              {timeSlots
                .filter(time => time > startTime)
                .map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
            </select>
          </div>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBooking}
          disabled={!selectedRoom || !selectedDate || !startTime || !endTime || !pic || !meetingName}
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
                      {booking.meetingName}
                    </p>
                    <p className
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
