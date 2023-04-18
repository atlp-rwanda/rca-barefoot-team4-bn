import express from 'express'
import { AirportController } from '../../controllers/flight/Airport.controller';
const router = express.Router();

const airportController = new AirportController()
router.post('/create', airportController.createAirport)
router.get('/all', airportController.getAllAirports)
router.get('/:id', airportController.getOneAirport)
router.put('/:id', airportController.updateAirport)

export default router