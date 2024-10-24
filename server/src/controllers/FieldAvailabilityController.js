const FieldAvailability = require('../models/Field_Availability');

exports.updatePrices = async (req, res) => {
    console.log('Request body:', req.body);
    
    const { field_id, timeSlots } = req.body;

    console.log('Received field_id:', field_id);
    console.log('Received timeSlots:', timeSlots);

    // Kiểm tra timeSlots có phải là mảng không
    if (!Array.isArray(timeSlots)) {
        return res.status(400).json({ message: 'timeSlots should be an array.' });
    }
    
    try {
        for (const slot of timeSlots) {
            const { availability_date, start_time, end_time, price } = slot;

            // Kiểm tra xem khung giờ đã tồn tại hay chưa
            let existingSlot = await FieldAvailability.findOne({
                field_id,
                availability_date: new Date(availability_date),
                start_time,
                end_time
            });

            if (existingSlot) {
                // Khung giờ đã tồn tại, cập nhật giá tiền
                existingSlot.price = price;
                await existingSlot.save();
                console.log(`Updated slot: ${availability_date} from ${start_time} to ${end_time}`);
            } else {
                // Khung giờ chưa tồn tại, tạo mới
                const newSlot = new FieldAvailability({
                    field_id,
                    availability_date: new Date(availability_date),
                    start_time,
                    end_time,
                    price,
                    is_available: true  // Mặc định là còn trống khi tạo mới
                });

                await newSlot.save();
                console.log(`Created new slot: ${availability_date} from ${start_time} to ${end_time} with price: ${price}`);
            }
        }

        res.json({ message: 'Prices updated successfully for the selected time slots.' });
    } catch (error) {
        console.log('Error during update:', error);
        res.status(500).json({ message: 'Error updating prices', error: error.message || error });
    }
};
