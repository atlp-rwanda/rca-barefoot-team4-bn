import express from 'express'
import { FlightController } from '../../controllers/flight/Flight.controller';
const router = express.Router();

const flightController = new FlightController()
router.post('/create', flightController.createFlight)
router.post('/create-unified', flightController.createdUnifiedFlight)
router.post('/detail-flight', flightController.mapFlightClassAndPrice)
router.post('/book', flightController.bookFlight)
router.get('/all', flightController.getAllFlights)
router.get('/:id', flightController.getOneFlight)
router.put('/:id', flightController.updateFlight)

router.get('/all/:from/:to', flightController.getAllByAirports)
router.get('/all/by-time', flightController.getAllByTime)
router.post('/all/by-time-location', flightController.getAllByTimeAndLocation) //TODO: to change to GET later
router.get('/all/by-airline', flightController.getAllByAirline)
router.get('/all/available', flightController.getAllAvailableFlights)
router.get('/bookings/:id', flightController.getBookingsByUser)

// flight seats
router.get('/all-flight-seat-prices', flightController.getAllFlightSeatPrices)
router.get('/flight-seat-price/:id', flightController.getOneFlightSeatPrice)
router.get('/flight-seat-price-by-flight/:id', flightController.getFlightSeatPricesByFlight)
router.put('/flight-seat-price/edit/:id', flightController.updateFlightSeatPrice)

export default router