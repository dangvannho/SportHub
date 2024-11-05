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

const addFieldRates = async (req, res) => {
    const { field_id, startHour, endHour, price, is_weekend } = req.body;

    try {
        // Tìm sân theo ID
        const field = await Field.findById(field_id);

        if (!field) {
            return res.status(404).json({ message: "Không tìm thấy sân" });
        }

        // Đảm bảo mảng field.price được khởi tạo nếu chưa có
        if (!Array.isArray(field.price)) {
            field.price = [];
        }

        // Kiểm tra xung đột với các khung giờ đã có (so sánh chuỗi)
        const isConflict = field.price.some(existingSlot => {
            return (
                existingSlot.is_weekend === is_weekend &&
                (
                    (startHour >= existingSlot.startHour && startHour < existingSlot.endHour) || 
                    (endHour > existingSlot.startHour && endHour <= existingSlot.endHour) ||    
                    (existingSlot.startHour >= startHour && existingSlot.endHour <= endHour)
                )
            );
        });

        if (isConflict) {
            return res.status(400).json({ message: "Khung giờ đã nhập bị trùng với khung giờ đã có." });
        }

        // Thêm khung giờ mới vào mảng price
        const newPriceSlot = { startHour, endHour, price, is_weekend };
        field.price.push(newPriceSlot);

        // Lưu tài liệu Field đã cập nhật và lấy ID của khung giờ mới thêm
        await field.save();
        const addedPriceSlot = field.price[field.price.length - 1];
        const priceId = addedPriceSlot._id;

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + 1);

        const timeSlots = [
            "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
            "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
            "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
            "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", 
            "21:00", "21:30", "22:00"
        ];

        const fieldAvailabilityRecords = [];

        // Tạo các bản ghi khung giờ cho từng ngày trong tháng tới
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
            // kiểm tra ngày hiện tại có phải cuối tuần k
            if (isWeekend !== is_weekend) {
                continue;
            }

            for (let index = 0; index < timeSlots.length; index++) {
                const startTime = timeSlots[index];
                if (startTime >= startHour && startTime < endHour) {
                    fieldAvailabilityRecords.push({
                        field_id,
                        availability_date: new Date(d),
                        start_time: startTime,
                        end_time: timeSlots[index + 2] || "23:00",
                        is_available: true,
                        price,
                        price_id: priceId
                    });
                    index+=1;
                }
                
            };
        }

        if (fieldAvailabilityRecords.length > 0) {
            await FieldAvailability.insertMany(fieldAvailabilityRecords);
        }

        res.status(200).json({
            message: 'Thêm nhóm giờ và thiết lập giá cho các khung giờ thành công trong tháng tiếp theo.',
            field_id,
        });
    } catch (error) {
        console.error("Error in addFieldRates:", error);
        res.status(500).json({ error: 'Lỗi khi áp dụng giá cho các khung giờ.' });
    }
};



const updateFieldRate = async (req, res) => {
    const { field_id, price_id, newPrice } = req.body;

    try {
        // Find the field by ID
        const field = await Field.findById(field_id);
        if (!field) {
            return res.status(404).json({ message: "Không tìm thấy sân" });
        }

        // Locate the specific time slot to update in the field's price array using price_id
        const slotIndex = field.price.findIndex(slot => slot._id.toString() === price_id);
        
        if (slotIndex === -1) {
            return res.status(404).json({ message: "Không tìm thấy nhóm giờ để cập nhật" });
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

        res.status(200).json({ message: "Cập nhật giá khung giờ thành công" });
    } catch (error) {
        console.error("Error in updateFieldRate:", error);
        res.status(500).json({ error: "Lỗi khi cập nhật giá khung giờ" });
    }
};



const deleteFieldRate = async (req, res) => {
    const { field_id, price_id } = req.body;

    try {
        // Find the field by ID
        const field = await Field.findById(field_id);
        if (!field) {
            return res.status(404).json({ message: "Không tìm thấy sân" });
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

        res.status(200).json({ message: "Xoá nhóm giờ thành công" });
    } catch (error) {
        console.error("Error in deleteFieldRate:", error);
        res.status(500).json({ error: "Lỗi khi xoá nhóm giờ" });
    }
};





module.exports = { getFieldsByOwnerId, addFieldRates, updateFieldRate, deleteFieldRate};
