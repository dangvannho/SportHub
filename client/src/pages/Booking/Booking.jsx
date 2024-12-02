import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";

import getTimeField from "~/services/Field/getTimeField";
import payment from "~/services/Payment/Payment";
import "tippy.js/dist/tippy.css";
import "./Booking.css";

function Booking() {
  const { id } = useParams();

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [timeId, setTimeId] = useState("");

  const filterPastEvents = (events) => {
    const currentTime = new Date();
    return events.filter((event) => new Date(event.start) > currentTime);
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getTimeField(id);
      if (data.EC === 1) {
        const events = data.DT.map((item) => ({
          start:
            item.availability_date.split("T")[0] +
            "T" +
            item.start_time +
            ":00",
          end:
            item.availability_date.split("T")[0] + "T" + item.end_time + ":00",
          extendedProps: {
            price: item.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            }),
            status: item.is_available,
            timeId: item._id,
          },
        }));
        setFilteredEvents(filterPastEvents(events));
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleBookClick = (event) => {
    // Chỉ cho phép đặt lịch nếu sân chưa được đặt
    if (event.extendedProps.status === true) {
      setTimeId(event.extendedProps.timeId);
      setSelectedSlot(event);
    }
  };

  const handlePayment = async () => {
    setSelectedSlot(null);
    const res = await payment(timeId);
    const link = res.order_url;
    window.open(link, "_blank");
  };

  const eventContent = (eventInfo) => {
    const isBooked = eventInfo.event.extendedProps.status === false;
    return (
      <div className={`event-content ${eventInfo.event.extendedProps.status}`}>
        {isBooked && <div className="event-status">Đã đặt</div>}
        <div className="event-price">
          <p> {eventInfo.timeText}</p>
          <p> {eventInfo.event.extendedProps.price}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="booking-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        height={"100%"}
        headerToolbar={{
          start: "today prev, next",
          center: "title",
          end: "dayGridMonth, timeGridWeek, timeGridDay",
        }}
        events={filteredEvents}
        locale={viLocale}
        // slotDuration="01:00:00"
        slotDuration="00:30:00"
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        allDaySlot={false}
        eventContent={eventContent}
        eventClick={(info) => handleBookClick(info.event)}
      />
      {selectedSlot && (
        <div className="booking-summary">
          <button
            className="close-button"
            onClick={() => setSelectedSlot(null)}
          >
            ×
          </button>
          <h3>Thông tin đặt sân</h3>
          <p>
            Thời gian: {new Date(selectedSlot.start).toLocaleString()} -{" "}
            {new Date(selectedSlot.end).toLocaleString()}
          </p>
          <p>Giá: {selectedSlot.extendedProps.price}</p>
          <button className="btn-book" onClick={handlePayment}>
            Đặt lịch
          </button>
        </div>
      )}
    </div>
  );
}

export default Booking;
