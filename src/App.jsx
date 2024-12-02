import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Trash2, AlertCircle } from 'lucide-react';
import axios from 'axios';

function App() {
  const [bookings, setBookings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [pic, setPic] = useState('');
  const [meetingName, setMeetingName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const rooms = [
    { id: 'zoom', name: 'Zoom Room' },
    { id: 'room1', name: 'Meeting Room 1' },
    { id: 'room2', name: 'Meeting Room 2' },
  ];

  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings. Please refresh the page.');
      console.error('Error fetching bookings:', err);
    }
  };

  const handleBooking = async () => {
    // Reset error state
    setError('');
    
    // Validate all required fields
    if (!selectedRoom || !selectedDate || !startTime || !endTime || !pic || !meetingName) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(selectedDate);
    if (bookingDate < today) {
      setError('Cannot book dates in the past');
      return;
    }

    const newBooking = {
      room: selectedRoom,
      date: selectedDate,
      startTime,
      endTime,
      pic: pic.trim(),
      meetingName: meetingName.trim(),
    };

    setLoading(true);
    try {
      const response = await axios.post('/api/bookings', newBooking);
      setBookings(prev => [...prev, response.data]);
      
      // Reset form
      setSelectedRoom('');
      setSelectedDate('');
      setStartTime('');
      setEndTime('');
      setPic('');
      setMeetingName('');
      
      // Show success message
      setError('');
    } catch (err) {
      console.error('Booking error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to save booking. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      await axios.delete(`/api/bookings/${id}`);
      setBookings(prev => prev.filter(booking => booking.id !== id));
    } catch (err) {
      setError('Failed to delete booking. Please try again.');
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Meeting Room Booking</h1>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {/* Booking Form */}
          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room *
                </label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select start time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select end time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Meeting Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Name *
                </label>
                <input
                  type="text"
                  value={meetingName}
                  onChange={(e) => setMeetingName(e.target.value)}
                  placeholder="Enter meeting name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Person In Charge (PIC) *
                </label>
                <input
                  type="text"
                  value={pic}
                  onChange={(e) => setPic(e.target.value)}
                  placeholder="Enter PIC name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors disabled:bg-blue-300"
            >
              {loading ? 'Booking...' : 'Book Room'}
            </button>
          </div>

          {/* Bookings List */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Bookings</h2>
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{booking.date}</span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{`${booking.startTime} - ${booking.endTime}`}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <User className="h-4 w-4" />
                      <span>{booking.pic}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{booking.meetingName}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        ({rooms.find(r => r.id === booking.room)?.name || booking.room})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBooking(booking.id)}
                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
              {bookings.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No bookings yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
