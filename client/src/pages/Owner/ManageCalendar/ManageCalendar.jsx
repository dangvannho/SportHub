import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
// import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "./ManageCalendar.css";

function ManageCalendar() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const filterPastEvents = (events) => {
    const currentTime = new Date();
    return events.filter((event) => new Date(event.start) > currentTime);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/field_availability/availability?field_id=672461d43ab26a47245be9fa");
        const data = await response.json();
        if (data.EC === 1) {
          const events = data.DT.map((item) => ({
            title: item.field_id,
            start: new Date(item.availability_date).toISOString().split('T')[0] + 'T' + item.start_time + ':00',
            end: new Date(item.availability_date).toISOString().split('T')[0] + 'T' + item.end_time + ':00',
            extendedProps: {
              price: item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
              status: item.is_available ? "true" : "false",
            },
          }));
          setFilteredEvents(filterPastEvents(events));
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleEventClick = (event) => {
    //if (event.extendedProps.status === "true") {
    setSelectedSlot(event);
    //}
  };

  const eventContent = (eventInfo) => {
    const isBooked = eventInfo.event.extendedProps.status === "false";
    return (
      <div
        className={`event-container ${eventInfo.event.extendedProps.status}`}
      >
        {isBooked && <div className="event-status">Đã đặt</div>}
        <div className="event-content">
          <p> {eventInfo.timeText}</p>
          <p> {eventInfo.event.extendedProps.price}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
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
        eventClick={(info) => handleEventClick(info.event)}
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
            <strong>Sân</strong>: {selectedSlot.title}
          </p>
          <p>
            <strong> Thời gian: </strong>
            {new Date(selectedSlot.start).toLocaleString()} -
            {new Date(selectedSlot.end).toLocaleString()}
          </p>
          <p>
            <strong>Giá: </strong> {selectedSlot.extendedProps.price}
          </p>
          <p>
            <strong>Trạng thái: </strong>
            <label style={{ marginLeft: '10px' }}>
              <input
                type="radio"
                name="status"
                value="false"
                checked={selectedSlot.extendedProps.status === "false"}
                onChange={() => {/* Xử lý thay đổi trạng thái */ }}
              />
              Đã đặt
            </label>
            <label style={{ marginLeft: '10px' }}>
              <input
                type="radio"
                name="status"
                value="true"
                checked={selectedSlot.extendedProps.status === "true"}
                onChange={() => {/* Xử lý thay đổi trạng thái */ }}
              />
              Chưa đặt
            </label>
          </p>
          <div className="action-btn">
            <button className="btn btn-warning">Sửa</button>
            <button className="btn btn-danger">Xoá</button>
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedSlot(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageCalendar;
