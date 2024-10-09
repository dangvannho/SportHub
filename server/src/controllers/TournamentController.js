const Tournament = require('../models/Tournament');
const getAllTournament = async (req, res) => {
    try {
        const tournaments = await Tournament.find({})
        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getTournament = async (req, res) => {
    try {
        const { id } = req.params;
        const tournament = await Tournament.findById(id)
        res.status(200).json(tournament);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
//add tournament
const addTournament = async (req, res) => {
    try {
        const tournament = await Tournament.create(req.body);
        res.status(200).json(tournament);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateTournament = async (req, res) => {
    try {
        const { id } = req.params;

        const tournament = await Tournament.findByIdAndUpdate(id, req.body);

        if (!tournament) {
            return res.status(404).json({ message: "Tournament not found" });
        }

        const updatedTournament = await Tournament.findById(id);
        res.status(200).json(updatedTournament)

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteTournament = async (req, res) => {
    try {
        const { id } = req.params;

        const tournament = await Tournament.findByIdAndDelete(id);

        if (!tournament) {
            return res.status(404).json({ message: "Tournament not found" });
        }

        res.status(200).json({ message: "Tournament Deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllTournament,
    getTournament,
    addTournament,
    updateTournament,
    deleteTournament
}
