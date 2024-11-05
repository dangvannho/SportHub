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

        // Kiểm tra xung đột với các khung giờ đã có
        const isConflict = field.price.some(existingSlot => {
            return (
                existingSlot.is_weekend === is_weekend && // Kiểm tra nếu là cùng loại ngày (cuối tuần/ngày thường)
                (
                    (startHour >= existingSlot.startHour && startHour < existingSlot.endHour) || // Khung giờ mới bắt đầu trong khung giờ đã có
                    (endHour > existingSlot.startHour && endHour <= existingSlot.endHour) ||    // Khung giờ mới kết thúc trong khung giờ đã có
                    (existingSlot.startHour >= startHour && existingSlot.endHour <= endHour)   // Khung giờ đã có nằm trong khung giờ mới
                )
            );
        });

        if (isConflict) {
            return res.status(400).json({ message: "Khung giờ đã nhập bị trùng với khung giờ đã có." });
        }

        // Thêm khung giờ mới vào mảng price
        field.price.push({ startHour, endHour, price, is_weekend });

        // Lưu tài liệu Field đã cập nhật
        await field.save();

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + 1);

        // Khung giờ từng tiếng
        const timeSlots = [
            "5:00", "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00",
            "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
        ];

        const fieldAvailabilityRecords = [];

        // Tạo các bản ghi khung giờ cho từng ngày trong tháng tới
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const isWeekend = d.getDay() === 0 || d.getDay() === 6;

            // Chỉ tạo các bản ghi cho nhóm giờ có is_weekend tương ứng
            if (isWeekend !== is_weekend) {
                continue; // Bỏ qua các ngày không phù hợp với is_weekend của rate
            }

            timeSlots.forEach((startTime, index) => {
                const startHourSlot = parseInt(startTime.split(":")[0]);

                // Kiểm tra nếu startHourSlot nằm trong khung giờ đã thêm vào
                if (startHourSlot >= startHour && startHourSlot < endHour) {
                    fieldAvailabilityRecords.push({
                        field_id,
                        availability_date: new Date(d),
                        start_time: startTime,
                        end_time: timeSlots[index + 1] || "23:00",
                        is_available: true,
                        price: price,
                        is_weekend: isWeekend
                    });
                }
            });
        }

        // Lưu tất cả các bản ghi FieldAvailability vào database
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
    const { field_id, startHour, endHour, is_weekend, newPrice } = req.body;

    try {
        // Find the field by ID
        const field = await Field.findById(field_id);
        if (!field) {
            return res.status(404).json({ message: "Không tìm thấy sân" });
        }

        // Locate the specific time slot to update in the field's price array
        const slotIndex = field.price.findIndex(slot =>
            slot.startHour === startHour &&
            slot.endHour === endHour &&
            slot.is_weekend === is_weekend
        );

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
                start_time: `${startHour}:00`,
                end_time: `${endHour}:00`,
                is_weekend
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
    const { field_id, startHour, endHour, is_weekend } = req.body;

    try {
        // Find the field by ID
        const field = await Field.findById(field_id);
        if (!field) {
            return res.status(404).json({ message: "Không tìm thấy sân" });
        }

        // Remove the specified time slot from the field's price array
        const updatedPriceArray = field.price.filter(slot =>
            !(slot.startHour === startHour && slot.endHour === endHour && slot.is_weekend === is_weekend)
        );

        if (updatedPriceArray.length === field.price.length) {
            return res.status(404).json({ message: "Không tìm thấy nhóm giờ để xoá" });
        }

        field.price = updatedPriceArray;
        await field.save();

        // Delete all matching FieldAvailability records
        await FieldAvailability.deleteMany({
            field_id,
            start_time: `${startHour}:00`,
            end_time: `${endHour}:00`,
            is_weekend
        });

        res.status(200).json({ message: "Xoá nhóm giờ thành công" });
    } catch (error) {
        console.error("Error in deleteFieldRate:", error);
        res.status(500).json({ error: "Lỗi khi xoá nhóm giờ" });
    }
};




module.exports = { getFieldsByOwnerId, addFieldRates, updateFieldRate, deleteFieldRate};
