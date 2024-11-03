import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
// import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "./Calendar.css";
import Booking from "../Booking/Booking";

function Calendar() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showDatLich, setShowDatLich] = useState(false);

  const filterPastEvents = (events) => {
    const currentTime = new Date();
    return events.filter((event) => new Date(event.start) > currentTime);
  };

  const events = [
    {
      title: "Sân số 1",
      start: "2024-11-04T22:30:00",
      end: "2024-11-04T23:30:00",
      extendedProps: {
        price: "300.000đ",
        status: "available", // chưa đặt
      },
    },
    {
      title: "Sân số 2",
      start: "2024-11-02T07:00:00",
      end: "2024-11-02T08:30:00",
      extendedProps: {
        price: "500.000đ",
        status: "booked", // đã đặt
      },
    },
    {
      title: "Sân số 3",
      start: "2024-11-02T19:00:00",
      end: "2024-11-02T20:00:00",
      extendedProps: {
        price: "700.000đ",
        status: "available",
      },
    },
    {
      title: "Sân số 4",
      start: "2024-11-02T09:00:00",
      end: "2024-11-02T10:30:00",
      extendedProps: {
        price: "400.000đ",
        status: "booked",
      },
    },
    {
      title: "Sân số 1",
      start: "2024-11-03T06:00:00",
      end: "2024-11-03T07:30:00",
      extendedProps: {
        price: "300.000đ",
        status: "available",
      },
    },
    {
      title: "Sân số 2",
      start: "2024-11-03T08:00:00",
      end: "2024-11-03T09:30:00",
      extendedProps: {
        price: "500.000đ",
        status: "booked",
      },
    },
    {
      title: "Sân số 3",
      start: "2024-11-03T15:00:00",
      end: "2024-11-03T16:30:00",
      extendedProps: {
        price: "600.000đ",
        status: "available",
      },
    },
    {
      title: "Sân số 4",
      start: "2024-11-03T17:00:00",
      end: "2024-11-03T18:30:00",
      extendedProps: {
        price: "700.000đ",
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

  const handleBookClick = (event) => {
    // Chỉ cho phép đặt lịch nếu sân chưa được đặt
    if (event.extendedProps.status === "available") {
      setSelectedSlot(event);
    }
  };

  const handleCloseDatLich = () => {
    setShowDatLich(false);
    setSelectedSlot(null);
  };

  const handleBookingClick = () => {
    setShowDatLich(true);
  };

  const eventContent = (eventInfo) => {
    const isBooked = eventInfo.event.extendedProps.status === "booked";
    return (
      <div className={`event-content ${eventInfo.event.extendedProps.status}`}>
        {isBooked && <div className="event-status">Đã đặt</div>}
        <div className="event-price">
          {eventInfo.event.title}
          <br />
          {eventInfo.event.extendedProps.price}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      {!showDatLich ? (
        <>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            height={"900px"}
            headerToolbar={{
              start: "today prev, next",
              center: "title",
              end: "dayGridMonth, timeGridWeek, timeGridDay",
            }}
            events={filteredEvents}
            locale={viLocale}
            editable={true}
            selectable={false}
            eventResizableFromStart={true}
            slotDuration="01:00:00"
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
              <p>Sân: {selectedSlot.title}</p>
              <p>
                Thời gian: {new Date(selectedSlot.start).toLocaleString()} -{" "}
                {new Date(selectedSlot.end).toLocaleString()}
              </p>
              <p>Giá: {selectedSlot.extendedProps.price}</p>
              <button className="btn-book" onClick={handleBookingClick}>
                Đặt lịch
              </button>
            </div>
          )}
        </>
      ) : (
        <Booking selectedSlot={selectedSlot} onClose={handleCloseDatLich} />
      )}
    </div>
  );
}

export default Calendar;
