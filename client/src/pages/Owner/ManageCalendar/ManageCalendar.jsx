import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import { toast } from "react-toastify";

import getTimeField from "~/services/Field/getTimeField";
import updateStatus from "~/services/Field/updateStatus";
import deleteTime from "~/services/Field/deleteTime";
import "tippy.js/dist/tippy.css";
import "./ManageCalendar.css";

function ManageCalendar() {
  const { id } = useParams();

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [status, setStatus] = useState();

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
            new Date(item.availability_date).toISOString().split("T")[0] +
            "T" +
            item.start_time +
            ":00",
          end:
            new Date(item.availability_date).toISOString().split("T")[0] +
            "T" +
            item.end_time +
            ":00",
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

  const handleClose = () => {
    setSelectedSlot(null);
  };

  const handleDeleteTime = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xoá khung giờ này ?")) {
      const res = await deleteTime(timeId);
      if (res.EC === 1) {
        toast.success(res.EM);
        fetchEvents();
        handleClose();
      } else {
        toast.error(res.EM);
      }
    }
  };

  const handleEventClick = (event) => {
    setTimeId(event.extendedProps.timeId);
    setStatus(event.extendedProps.status);
    //if (event.extendedProps.status === "true") {
    setSelectedSlot(event);

    //}
  };

  const handleStatusChange = (status) => {
    setStatus(status);
  };

  const handleUpdateStatus = async () => {
    const res = await updateStatus(timeId, status);
    if (res.EC === 1) {
      toast.success(res.EM);
      fetchEvents();
      handleClose();
    } else {
      toast.success(res.EM);
    }
  };

  const eventContent = (eventInfo) => {
    const isBooked = eventInfo.event.extendedProps.status;
    return (
      <div className={`event-container ${!isBooked ? "booked" : ""}`}>
        {!isBooked && <div className="event-status">Đã đặt</div>}
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
        <div className="booking-summary-overlay">
          <div className="booking-summary">
            <button className="close-button" onClick={handleClose}>
              ×
            </button>
            <h3>Thông tin đặt sân</h3>

            <p>
              <strong> Thời gian: </strong>
              {new Date(selectedSlot.start).toLocaleString()} -
              {new Date(selectedSlot.end).toLocaleString()}
            </p>
            <p>
              <strong>Giá: </strong> {selectedSlot.extendedProps.price}
            </p>
            <div className="group-status">
              <strong>Trạng thái: </strong>

              <div className="item-status">
                <input
                  type="radio"
                  name="status"
                  value={selectedSlot.extendedProps.status}
                  checked={status === false}
                  onChange={() => handleStatusChange(false)}
                />

                <label>Đã đặt</label>
              </div>

              <div className="item-status">
                <input
                  type="radio"
                  name="status"
                  value={selectedSlot.extendedProps.status}
                  checked={status === true}
                  onChange={() => handleStatusChange(true)}
                />

                <label>Chưa đặt</label>
              </div>
            </div>
            <div className="action-btn">
              <button className="btn btn-warning" onClick={handleUpdateStatus}>
                Sửa
              </button>
              <button className="btn btn-danger" onClick={handleDeleteTime}>
                Xoá
              </button>
              <button className="btn btn-secondary" onClick={handleClose}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageCalendar;
