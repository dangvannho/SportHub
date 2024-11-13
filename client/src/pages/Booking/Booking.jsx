import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
// import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "./Booking.css";
// import Booking from "~/components/Booking/Booking";

function Booking() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  // const [showDatLich, setShowDatLich] = useState(false);

  const filterPastEvents = (events) => {
    const currentTime = new Date();
    return events.filter((event) => new Date(event.start) > currentTime);
  };

  const events = [
    {
      title: "Sân số 1",
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

  const handleBookClick = (event) => {
    // Chỉ cho phép đặt lịch nếu sân chưa được đặt
    if (event.extendedProps.status === "available") {
      setSelectedSlot(event);
    }
  };

  // const handleCloseDatLich = () => {
  //   setShowDatLich(false);
  //   setSelectedSlot(null);
  // };

  // const handleBookingBtn = () => {
  //   setShowDatLich(true);
  // };

  const eventContent = (eventInfo) => {
    const isBooked = eventInfo.event.extendedProps.status === "booked";
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
          <p>Sân: {selectedSlot.title}</p>
          <p>
            Thời gian: {new Date(selectedSlot.start).toLocaleString()} -{" "}
            {new Date(selectedSlot.end).toLocaleString()}
          </p>
          <p>Giá: {selectedSlot.extendedProps.price}</p>
          <button className="btn-book">Đặt lịch</button>
        </div>
      )}
    </div>
  );
}

export default Booking;
