import { readBookings, writeBookings } from './utils';

export default async function handler(req, res) {
  const method = req.method;

  switch (method) {
    case 'GET': {
      const bookings = readBookings();
      res.status(200).json(bookings);
      break;
    }

    case 'POST': {
      const newBooking = req.body;
      const bookings = readBookings();

      // Check for overlapping bookings
      const isOverlap = bookings.some((booking) => {
        return (
          booking.room === newBooking.room &&
          booking.date === newBooking.date &&
          newBooking.startTime < booking.endTime &&
          newBooking.endTime > booking.startTime
        );
      });

      if (isOverlap) {
        return res.status(400).json({ message: 'Booking overlaps with an existing booking.' });
      }

      bookings.push(newBooking);
      writeBookings(bookings);
      res.status(201).json(newBooking);
      break;
    }

    case 'DELETE': {
      const { id } = req.query;
      const bookings = readBookings();
      const updatedBookings = bookings.filter((_, index) => index !== parseInt(id, 10));
      writeBookings(updatedBookings);
      res.status(204).send();
      break;
    }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
