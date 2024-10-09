const express = require('express');
const router = express.Router();
const { getAllTournament, getTournament, addTournament, updateTournament, deleteTournament } = require('../controllers/TournamentController');

router.get('/', getAllTournament);

router.get('/:id', getTournament);

router.post('/', addTournament);

router.put('/:id', updateTournament);

router.delete('/:id', deleteTournament);

module.exports = router;



