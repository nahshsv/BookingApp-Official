import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [newSlot, setNewSlot] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);

  // Toast
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  // Fetch data
  useEffect(() => {
    fetchAvailability();
    fetchBookings();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await axios.get("http://localhost:5000/availability");
      setAvailability(res.data);
    } catch (err) {
      console.error(err);
      showToast("error", "❌ Failed to load availability");
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/booking/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      showToast("error", "❌ Failed to load bookings");
    }
  };

  // Calendar event click
  const handleSelectSlot = (slotInfo) => {
    const dateStr = format(slotInfo.start, "yyyy-MM-dd");
    setSelectedDate(dateStr);
    const found = availability.find((a) => a.date === dateStr);
    setSelectedSlots(found ? found.slots : []);
  };

  const addSlot = () => {
    if (!newSlot.trim()) return showToast("warning", "⚠️ Please enter a time!");
    const updated = [...selectedSlots, newSlot.trim()];
    setSelectedSlots(updated);
    setNewSlot("");
  };

  const removeSlot = (time) => {
    setSelectedSlots(selectedSlots.filter((t) => t !== time));
  };

  // ✅ Save availability (đúng format backend cũ)
  const saveAvailability = async () => {
    if (!selectedDate)
      return showToast("warning", "⚠️ Please select a date first!");
    if (selectedSlots.length === 0)
      return showToast("warning", "⚠️ No slots to save. Please add one!");

    try {
      await axios.put(
  `http://localhost:5000/availability/${selectedDate}`,
  { slots: selectedSlots },
  { headers: { Authorization: `Bearer ${token}` } }
);

      showToast("success", "✅ Availability updated successfully!");
      fetchAvailability();
    } catch (err) {
      console.error("❌ Save error:", err);
      showToast("error", "❌ Failed to update availability!");
    }
  };

  // Events merge
  const events = availability.flatMap((a) =>
    a.slots.map((time) => {
      const booking = bookings.find(
        (b) => b.date === a.date && b.time.trim() === time.trim()
      );
      const isBooked = !!booking;
      return {
        title: isBooked
          ? `Booked: ${booking.name} (${booking.service})`
          : `Available: ${time}`,
        start: new Date(`${a.date}T${time}`),
        end: new Date(`${a.date}T${time}`),
        allDay: false,
        isBooked,
        bookingData: booking || null,
      };
    })
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = sortedBookings.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const formatDateTime = (dt) =>
    dt ? format(new Date(dt), "MMM dd, yyyy, hh:mm a") : "—";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 relative">
      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg text-white z-50 ${
            toast.type === "success"
              ? "bg-green-600"
              : toast.type === "error"
              ? "bg-red-600"
              : "bg-yellow-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900 mt-24">
        Admin Dashboard
      </h1>

      {/* Calendar */}
      <div className="bg-white p-4 rounded-xl shadow-md max-w-6xl mx-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 border-b pb-2 text-gray-800">
          Weekly / Monthly Calendar
        </h2>
        <div className="w-full overflow-x-auto rounded-xl border border-gray-100">
          <div className="min-w-[900px] sm:min-w-full">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{
                height: 550,
                minWidth: "900px",
              }}
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={(event) => {
                if (event.isBooked) setSelectedBooking(event.bookingData);
              }}
              popup
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: event.isBooked ? "#EF4444" : "#2563EB",
                  color: "white",
                  borderRadius: "6px",
                  padding: "2px 6px",
                  fontSize: "0.85rem",
                },
              })}
            />
          </div>
        </div>
      </div>

      {/* Add & Save Availability */}
      {selectedDate && (
        <div className="bg-white mt-8 p-4 sm:p-6 rounded-xl shadow-md max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">
            Availability for: {selectedDate}
          </h2>

          <ul className="space-y-2 mb-4">
            {selectedSlots.length === 0 ? (
              <p className="text-gray-500">No slots yet. Add one below 👇</p>
            ) : (
              selectedSlots.map((t, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md text-sm sm:text-base"
                >
                  <span>{t}</span>
                  <button
                    onClick={() => removeSlot(t)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </li>
              ))
            )}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="time"
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              className="border p-2 rounded-md w-full sm:w-40"
            />
            <button
              onClick={addSlot}
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              + Add Slot
            </button>
          </div>

          <button
            onClick={saveAvailability}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 w-full sm:w-auto"
          >
            💾 Save Availability
          </button>
        </div>
      )}

      {/* Booking Table */}
      <section className="bg-white shadow-md rounded-xl p-4 sm:p-6 mt-8 max-w-6xl mx-auto">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          All Appointments
        </h2>

        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-[800px] w-full text-left text-sm sm:text-base border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border-b">Client</th>
                    <th className="p-2 border-b hidden sm:table-cell">Email</th>
                    <th className="p-2 border-b">Service</th>
                    <th className="p-2 border-b">Date</th>
                    <th className="p-2 border-b hidden md:table-cell">Time</th>
                    <th className="p-2 border-b hidden lg:table-cell">Note</th>
                    <th className="p-2 border-b hidden lg:table-cell">
                      Booked At
                    </th>
                    <th className="p-2 border-b">Image</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50">
                      <td className="p-2 border-b">{b.name}</td>
                      <td className="p-2 border-b hidden sm:table-cell">
                        {b.email || "-"}
                      </td>
                      <td className="p-2 border-b">{b.service}</td>
                      <td className="p-2 border-b">{b.date}</td>
                      <td className="p-2 border-b hidden md:table-cell">
                        {b.time}
                      </td>
                      <td className="p-2 border-b hidden lg:table-cell">
                        {b.note || "—"}
                      </td>
                      <td className="p-2 border-b hidden lg:table-cell">
                        {formatDateTime(b.createdAt)}
                      </td>
                      <td className="p-2 border-b">
                        {b.imagePath ? (
                          <button
                            onClick={() =>
                              setZoomImage(`http://localhost:5000${b.imagePath}`)
                            }
                            className="text-blue-600 underline text-sm"
                          >
                            View
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-4 text-sm sm:text-base">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                Prev
              </button>

              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>

      {/* Zoom Image */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            alt="Zoomed"
            className="max-w-[95vw] max-h-[85vh] rounded-lg shadow-2xl animate-zoom"
          />
        </div>
      )}

      <style>{`
        @keyframes zoom {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-zoom { animation: zoom 0.3s ease-out; }
      `}</style>
    </div>
  );
}
