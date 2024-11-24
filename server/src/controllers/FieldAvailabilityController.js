const FieldAvailability = require("../models/Field_Availability");

const getFieldAvailability = async (req, res) => {
    try {
        const { field_id } = req.query;

        if (!field_id) {
            return res.status(400).json({
                EC: 0,
                EM: "Thiếu field_id, price_id hoặc availability_date"
            });
        }

        const availabilities = await FieldAvailability.find({
            field_id: field_id,

        });

        if (!availabilities || availabilities.length === 0) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy dữ liệu"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Lấy dữ liệu thành công",
            DT: availabilities
        });
    } catch (error) {
        console.error("Error in getFieldAvailability:", error);
        res.status(500).json({
            EC: 0,
            EM: "Lỗi server"
        });
    }
};
const updateFieldAvailabilityStatus = async (req, res) => {
    try {
        const { field_id, availability_date, start_time, end_time, is_available } = req.body;

        if (typeof is_available !== 'boolean') {
            return res.status(400).json({
                EC: 0,
                EM: "is_available phải là true hoặc false"
            });
        }

        if (!field_id || !availability_date || !start_time || !end_time || is_available === undefined) {
            return res.status(400).json({
                EC: 0,
                EM: "Thiếu field_id, availability_date, start_time, end_time hoặc is_available"
            });
        }

        const availability = await FieldAvailability.findOneAndUpdate(
            {
                field_id: field_id,
                availability_date: availability_date,
                start_time: start_time,
                end_time: end_time
            },
            { is_available: is_available },
            { new: true }
        );

        if (!availability) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy dữ liệu để cập nhật"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Cập nhật trạng thái thành công",
            DT: availability
        });
    } catch (error) {
        console.error("Error in updateFieldAvailabilityStatus:", error);
        res.status(500).json({
            EC: 0,
            EM: "Lỗi server"
        });
    }
};
const deleteFieldAvailability = async (req, res) => {
    try {
        const { field_id, availability_date, start_time, end_time } = req.body;

        if (!field_id || !availability_date || !start_time || !end_time) {
            return res.status(400).json({
                EC: 0,
                EM: "Thiếu field_id, availability_date, start_time hoặc end_time"
            });
        }

        const deletedAvailability = await FieldAvailability.findOneAndDelete({
            field_id: field_id,
            availability_date: availability_date,
            start_time: start_time,
            end_time: end_time
        });

        if (!deletedAvailability) {
            return res.status(404).json({
                EC: 0,
                EM: "Không tìm thấy dữ liệu để xóa"
            });
        }

        res.status(200).json({
            EC: 1,
            EM: "Xóa trạng thái thành công",
            DT: deletedAvailability
        });
    } catch (error) {
        console.error("Error in deleteFieldAvailability:", error);
        res.status(500).json({
            EC: 0,
            EM: "Lỗi server"
        });
    }
};


module.exports = {
    getFieldAvailability,
    updateFieldAvailabilityStatus,
    deleteFieldAvailability
}; 