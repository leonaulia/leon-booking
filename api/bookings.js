import { readBookings, writeBookings } from './utils.js';

// Validation helper
const validateBooking = (booking) => {
  const required = ['room', 'date', 'startTime', 'endTime', 'pic', 'meetingName'];
  for (const field of required) {
    if (!booking[field]) {
      return `Missing required field: ${field}`;
    }
  }

  // Validate time format (HH:00)
  const timeFormat = /^([0-1]?[0-9]|2[0-3]):00$/;
  if (!timeFormat.test(booking.startTime) || !timeFormat.test(booking.endTime)) {
    return 'Invalid time format. Use HH:00 format';
  }

  // Validate date format (YYYY-MM-DD)
  const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateFormat.test(booking.date)) {
    return 'Invalid date format. Use YYYY-MM-DD format';
  }

  // Validate start time is before end time
  if (booking.startTime >= booking.endTime) {
    return 'End time must be after start time';
  }

  return null;
};

export default async function handler(req, res) {
  try {
    const method = req.method;

    switch (method) {
      case 'GET': {
        const bookings = readBookings();
        return res.status(200).json(bookings);
      }

      case 'POST': {
        const newBooking = req.body;
        
        // Validate the booking
        const validationError = validateBooking(newBooking);
        if (validationError) {
          return res.status(400).json({ message: validationError });
        }

        const bookings = readBookings();

        // Check for overlapping bookings
        const isOverlap = bookings.some((booking) => {
          return (
            booking.room === newBooking.room &&
            booking.date === newBooking.date &&
            ((newBooking.startTime >= booking.startTime && newBooking.startTime < booking.endTime) ||
             (newBooking.endTime > booking.startTime && newBooking.endTime <= booking.endTime) ||
             (newBooking.startTime <= booking.startTime && newBooking.endTime >= booking.endTime))
          );
        });

        if (isOverlap) {
          return res.status(409).json({ 
            message: 'This time slot is already booked.',
            type: 'overlap'
          });
        }

        // Add timestamp and ID to the booking
        const timestamp = new Date().toISOString();
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const bookingWithMeta = {
          ...newBooking,
          id,
          createdAt: timestamp,
          updatedAt: timestamp
        };

        bookings.push(bookingWithMeta);
        const success = writeBookings(bookings);
        
        if (!success) {
          return res.status(500).json({ message: 'Failed to save booking' });
        }

        return res.status(201).json(bookingWithMeta);
      }

      case 'DELETE': {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ message: 'Booking ID is required' });
        }

        const bookings = readBookings();
        const index = bookings.findIndex(booking => booking.id === id);
        
        if (index === -1) {
          return res.status(404).json({ message: 'Booking not found' });
        }

        bookings.splice(index, 1);
        const success = writeBookings(bookings);

        if (!success) {
          return res.status(500).json({ message: 'Failed to delete booking' });
        }

        return res.status(204).send();
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
