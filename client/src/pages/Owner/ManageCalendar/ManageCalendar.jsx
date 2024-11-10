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

  const events = [
    {
      // title: "Sân số 1",
      start: "2024-11-10T22:30:00",
      end: "2024-11-10T23:30:00",
      extendedProps: {
        price: "300.000đ",
        status: "available",
      },
    },
    {
      title: "Sân số 2",
      start: "2024-11-10T18:00:00",
      end: "2024-11-10T19:00:00",
      extendedProps: {
        price: "500.000đ",
        status: "booked",
      },
    },
    {
      title: "Sân số 3",
      start: "2024-11-11T09:00:00",
      end: "2024-11-11T10:00:00",
      extendedProps: {
        price: "400.000đ",
        status: "available",
      },
    },
    {
      title: "Sân số 4",
      start: "2024-11-11T14:00:00",
      end: "2024-11-11T15:00:00",
      extendedProps: {
        price: "450.000đ",
        status: "booked",
      },
    },
    {
      title: "Sân số 5",
      start: "2024-11-12T08:30:00",
      end: "2024-11-12T09:30:00",
      extendedProps: {
        price: "350.000đ",
        status: "available",
      },
    },
    {
      title: "Sân số 1",
      start: "2024-11-12T19:00:00",
      end: "2024-11-12T20:00:00",
      extendedProps: {
        price: "300.000đ",
        status: "booked",
      },
    },
    {
      title: "Sân số 3",
      start: "2024-11-13T12:00:00",
      end: "2024-11-13T13:00:00",
      extendedProps: {
        price: "400.000đ",
        status: "available",
      },
    },
    {
      title: "Sân số 2",
      start: "2024-11-13T15:00:00",
      end: "2024-11-13T16:00:00",
      extendedProps: {
        price: "500.000đ",
        status: "booked",
      },
    },
    {
      title: "Sân số 4",
      start: "2024-11-14T10:00:00",
      end: "2024-11-14T11:00:00",
      extendedProps: {
        price: "450.000đ",
        status: "available",
      },
    },
    {
      title: "Sân số 5",
      start: "2024-11-14T17:30:00",
      end: "2024-11-14T18:30:00",
      extendedProps: {
        price: "350.000đ",
        status: "booked",
      },
    },
    {
      title: "Sân số 1",
      start: "2024-11-15T09:30:00",
      end: "2024-11-15T10:30:00",
      extendedProps: {
        price: "300.000đ",
        status: "available",
      },
    },
    {
      title: "Sân số 2",
      start: "2024-11-15T20:00:00",
      end: "2024-11-15T21:00:00",
      extendedProps: {
        price: "500.000đ",
        status: "booked",
      },
    },
    {
      title: "Sân số 3",
      start: "2024-11-16T11:30:00",
      end: "2024-11-16T12:30:00",
      extendedProps: {
        price: "400.000đ",
        status: "available",
      },
    },
    {
      title: "Sân số 4",
      start: "2024-11-16T16:00:00",
      end: "2024-11-16T17:00:00",
      extendedProps: {
        price: "450.000đ",
        status: "booked",
      },
    },
  ];

  useEffect(() => {
    // Update filtered events every minute
    const updateFilteredEvents = () => {
      setFilteredEvents(filterPastEvents(events));
    };

    updateFilteredEvents(); // Initial filter
    const interval = setInterval(updateFilteredEvents, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleEventClick = (event) => {
    if (event.extendedProps.status === "available") {
      setSelectedSlot(event);
    }
  };

  const eventContent = (eventInfo) => {
    const isBooked = eventInfo.event.extendedProps.status === "booked";
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
            {selectedSlot.extendedProps.status === "booked" ? (
              <span className="booked-status"> Đã đặt</span>
            ) : (
              <span className="available-status"> Chưa đặt</span>
            )}
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
