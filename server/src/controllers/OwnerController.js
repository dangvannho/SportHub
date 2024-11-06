const Field = require("../models/Field");
const FieldAvailability = require("../models/Field_Availability");
const Pagination = require("../utils/Pagination");
const { authenticateUser } = require("../utils/checkOwner");

const getFieldsByOwnerId = async (req, res) => {
    try {
        const owner_id = authenticateUser(req);

        // Kiểm tra nếu không có owner_id để gửi phản hồi lỗi
        if (!owner_id) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const page = req.query.page || 1;
        const limit = req.query.limit || 9;

        // Tạo truy vấn tìm kiếm các sân theo owner_id
        const fieldsQuery = Field.find({ owner_id });

        // Sử dụng Pagination để phân trang
        const pagination = new Pagination(fieldsQuery, page, limit);
        const paginatedResults = await pagination.paginate();

        res.status(200).json(paginatedResults);
    } catch (error) {
        // Xử lý các lỗi khác
        res.status(500).json({ error: error.message });
    }
};

const getFieldPriceSlots = async (req, res) => {
    const { field_id } = req.body; // Assuming field_id is passed as a URL parameter

    try {
        // Find the field by ID
        const field = await Field.findById(field_id);

        // If the field does not exist, return a 404 error
        if (!field) {
            return res.status(404).json({
                EC: 1,
                EM: "Không tìm thấy sân" });
        }

        // Return the price array containing all price slots
        res.status(200).json({
            EC: 1,
            EM: "Danh sách các priceSlot thành công",
            priceSlots: field.price
        });
    } catch (error) {
        console.error("Error in getFieldPriceSlots:", error);
        res.status(500).json({ error: "Lỗi khi lấy danh sách priceSlot" });
    }
};


const addPriceSlot = async (req, res) => {
    const { field_id, startHour, endHour, price, is_weekend } = req.body;

    try {
        const field = await Field.findById(field_id);
        if (!field) {
            return res.status(404).json({ 
                EC: 1,
                EM: "Không tìm thấy sân" });
        }

        if (!Array.isArray(field.price)) {
            field.price = [];
        }

        const isConflict = field.price.some(existingSlot => (
            existingSlot.is_weekend === is_weekend &&
            ((startHour >= existingSlot.startHour && startHour < existingSlot.endHour) || 
             (endHour > existingSlot.startHour && endHour <= existingSlot.endHour) ||    
             (existingSlot.startHour >= startHour && existingSlot.endHour <= endHour))
        ));

        if (isConflict) {
            return res.status(400).json({
                EC: 0,
                EM: "Khung giờ đã nhập bị trùng với khung giờ đã có." });
        }

        const newPriceSlot = { startHour, endHour, price, is_weekend };
        field.price.push(newPriceSlot);
        await field.save();

        res.status(200).json({
            EC : 1,
            EM: 'Thêm nhóm giờ thành công.', priceSlot: newPriceSlot });
    } catch (error) {
        console.error("Error in addPriceSlot:", error);
        res.status(500).json({ 
            EC: 0,
            EM : 'Lỗi khi thêm khung giờ.' });
    }
};

const generateAvailabilityRecords = async (req, res) => {
    const { field_id, startDate, endDate } = req.body;

    try {
        const field = await Field.findById(field_id);
        if (!field) {
            return res.status(404).json({ 
                EC: 0,
                EM: "Không tìm thấy sân" });
        }

        const fieldAvailabilityRecords = [];
        const timeSlots = [
            "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
            "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
            "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
            "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", 
            "21:00", "21:30", "22:00"
        ];

        const start = new Date(startDate);
        const end = new Date(endDate);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;

            for (const priceSlot of field.price) {
                if (priceSlot.is_weekend !== isWeekend) continue;

                for (let index = 0; index < timeSlots.length; index++) {
                    const startTime = timeSlots[index];
                    if (startTime >= priceSlot.startHour && startTime < priceSlot.endHour) {
                        // Check if a record already exists for this date, time, and field
                        const existingRecord = await FieldAvailability.findOne({
                            field_id,
                            availability_date: d,
                            start_time: startTime,
                            end_time: timeSlots[index + 2] || "23:00"
                        });

                        if (!existingRecord) {
                            fieldAvailabilityRecords.push({
                                field_id,
                                availability_date: new Date(d),
                                start_time: startTime,
                                end_time: timeSlots[index + 2] || "23:00",
                                is_available: true,
                                price: priceSlot.price,
                                price_id: priceSlot._id,
                            });
                        }

                        index += 1;
                    }
                }
            }
        }

        if (fieldAvailabilityRecords.length > 0) {
            await FieldAvailability.insertMany(fieldAvailabilityRecords);
        }

        res.status(200).json({ 
            EC: 1,
            EM: 'Thêm các bản ghi khung giờ thành công.' });
    } catch (error) {
        console.error("Error in generateAvailabilityRecords:", error);
        res.status(500).json({ 
            EC: 0,
            EM: 'Lỗi khi tạo các bản ghi khung giờ.' });
    }
};




const updateFieldRate = async (req, res) => {
    const { field_id, price_id, newPrice } = req.body;

    try {
        // Find the field by ID
        const field = await Field.findById(field_id);
        if (!field) {
            return res.status(404).json({ 
                EC: 0,
                EM: "Không tìm thấy sân" });
        }

        // Locate the specific time slot to update in the field's price array using price_id
        const slotIndex = field.price.findIndex(slot => slot._id.toString() === price_id);
        
        if (slotIndex === -1) {
            return res.status(404).json({ 
                EC: 0,
                EM: "Không tìm thấy nhóm giờ để cập nhật" });
        }

        // Update the price of the found time slot
        field.price[slotIndex].price = newPrice;
        await field.save();

        // Update all matching FieldAvailability records with the new price
        await FieldAvailability.updateMany(
            {
                field_id,
                price_id
            },
            { $set: { price: newPrice } }
        );

        res.status(200).json({ 
            EC: 1,
            EM: "Cập nhật giá khung giờ thành công" });
    } catch (error) {
        console.error("Error in updateFieldRate:", error);
        res.status(500).json({ 
            EC: 0,
            EM: "Lỗi khi cập nhật giá khung giờ" });
    }
};



const deleteFieldRate = async (req, res) => {
    const { field_id, price_id } = req.body;

    try {
        // Find the field by ID
        const field = await Field.findById(field_id);
        if (!field) {
            return res.status(404).json({ 
                EC: 0,
                EM: "Không tìm thấy sân" });
        }

        // Remove the specified time slot from the field's price array using price_id
        const updatedPriceArray = field.price.filter(slot => slot._id.toString() !== price_id);

        if (updatedPriceArray.length === field.price.length) {
            return res.status(404).json({ message: "Không tìm thấy nhóm giờ để xoá" });
        }

        field.price = updatedPriceArray;
        await field.save();

        // Delete all matching FieldAvailability records with the price_id
        await FieldAvailability.deleteMany({
            field_id,
            price_id
        });

        res.status(200).json({ 
            EC: 1,
            EM: "Xoá nhóm giờ thành công" });
    } catch (error) {
        console.error("Error in deleteFieldRate:", error);
        res.status(500).json({ 
            EC: 0,
            EM: "Lỗi khi xoá nhóm giờ" });
    }
};





module.exports = { getFieldsByOwnerId, generateAvailabilityRecords, addPriceSlot, updateFieldRate, deleteFieldRate, getFieldPriceSlots};
