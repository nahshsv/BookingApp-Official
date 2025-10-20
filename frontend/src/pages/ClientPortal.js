import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, startOfToday } from "date-fns";

export default function ClientBooking() {
  const [availability, setAvailability] = useState([]);
  const [soldOut, setSoldOut] = useState(() => {
    const saved = localStorage.getItem("soldOutDates");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [form, setForm] = useState({ name: "", email: "", service: "" });
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const today = startOfToday();

  // 🟢 Lấy danh sách ngày có slot
  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await axios.get("http://localhost:5000/availability");

      const cleaned = res.data.map((a) => ({
        ...a,
        date: a.date?.toString().substring(0, 10)?.trim(),
        slots: (a.slots || []).map((s) => s.trim()).filter(Boolean),
      }));

      const filtered = cleaned.filter(
        (a) => a.slots.length > 0 && !soldOut.has(a.date)
      );
      setAvailability(filtered);
    } catch (err) {
      console.error("Error fetching availability:", err);
    }
  };

  // 🔸 Check ngày có slot
  const isAvailable = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    if (date < today) return false;
    if (soldOut.has(dateStr)) return false;
    return availability.some((a) => a.date?.trim() === dateStr);
  };

  // 🔹 Khi chọn ngày
  const handleDateChange = async (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    setSelectedDate(dateStr);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/available?date=${dateStr}`
      );
      const cleanedSlots = (data || []).map((s) => s.trim()).filter(Boolean);
      setSlots(cleanedSlots);
      setSelectedSlot("");
      if (cleanedSlots.length === 0) markSoldOut(dateStr);
    } catch (err) {
      console.error(err);
      setSlots([]);
      markSoldOut(dateStr);
    }
  };

  // ✅ Đánh dấu sold out
  const markSoldOut = (dateStr) => {
    setSoldOut((prev) => {
      const updated = new Set(prev).add(dateStr);
      localStorage.setItem("soldOutDates", JSON.stringify([...updated]));
      return updated;
    });
    setAvailability((prev) => prev.filter((a) => a.date !== dateStr));
  };

  // 🔹 Gửi booking
  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please log in first!");
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("service", form.service);
      formData.append("date", selectedDate);
      formData.append("time", selectedSlot);
      formData.append("note", note);
      if (file) formData.append("file", file);

      await axios.post("http://localhost:5000/booking/book", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const remaining = slots.filter((s) => s !== selectedSlot);
      setSlots(remaining);
      if (remaining.length === 0) markSoldOut(selectedDate);

      setForm({ name: "", email: "", service: "" });
      setSelectedSlot("");
      setNote("");
      setFile(null);

      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      console.error(err);
      alert("❌ Booking failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Calendar styling
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateStr = format(date, "yyyy-MM-dd");
      if (date < today) return "past-day";
      if (soldOut.has(dateStr)) return "disabled-day";
      if (isAvailable(date)) return "available-day";
      return "disabled-day";
    }
    return "";
  };

  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      const dateStr = format(date, "yyyy-MM-dd");
      return date < today || !isAvailable(date) || soldOut.has(dateStr);
    }
    return false;
  };

  return (
    <section className="min-h-screen bg-gray-50 pt-24 pb-20 flex flex-col items-center px-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-6 text-center">
        Book Your Appointment
      </h1>

      {/* 🗓️ Calendar */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center">
        <div className="w-full flex justify-center">
          <Calendar
            onClickDay={handleDateChange}
            tileDisabled={tileDisabled}
            tileClassName={tileClassName}
            prev2Label={null}
            next2Label={null}
            showNavigation={true}
            navigationLabel={({ date }) =>
              date.toLocaleString("en-US", { month: "long", year: "numeric" })
            }
            className="rounded-xl text-sm calendar-center"
          />
        </div>
      </div>

      <p className="text-gray-600 text-sm mt-4 text-center px-3 leading-relaxed">
        📅 Dates with{" "}
        <span className="font-semibold text-gray-900">white boxes</span> are
        available for booking.
      </p>

      {/* 📅 Booking Form */}
      {selectedDate && slots.length > 0 && (
        <div className="bg-white mt-10 p-8 rounded-2xl shadow-xl max-w-md w-full relative animate-fade">
          <h2 className="text-xl font-semibold text-center mb-3 text-zinc-800">
            Available Times for {selectedDate}
          </h2>

          <div className="mb-5 space-y-2">
            <p className="font-semibold text-zinc-700">Select Time</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {slots.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSlot(t)}
                  className={`border rounded-lg py-2 text-sm ${
                    selectedSlot === t
                      ? "bg-zinc-900 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleBook} className="space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 p-3 rounded-lg text-sm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 p-3 rounded-lg text-sm"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <select
              className="w-full border border-gray-300 p-3 rounded-lg text-sm"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              required
            >
              <option value="">Select Service</option>
              <option value="Nails">Nails</option>
              <option value="Pedicure">Pedicure</option>
              <option value="Eyebrows">Eyebrows</option>
            </select>

            <textarea
              placeholder="Other Notes (optional)"
              className="w-full border border-gray-300 p-3 rounded-lg text-sm"
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 p-3 rounded-lg text-sm"
            />

            {file && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">📷 Preview:</p>
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="rounded-lg shadow-sm max-h-40 object-cover"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedSlot || loading}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedSlot && !loading
                  ? "bg-gradient-to-r from-zinc-900 to-neutral-700 text-white hover:scale-[1.02]"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              {loading ? "Booking..." : "Confirm Appointment"}
            </button>
          </form>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium animate-fade-in-out">
          ✅ Appointment booked successfully!
        </div>
      )}

      {/* 💅 CSS Fix */}
      <style>{`
        .react-calendar {
          width: 100% !important;
          max-width: 360px;
          margin: 0 auto;
          border-radius: 1rem;
          border: none;
          background: #fff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
          overflow: hidden;
          transition: all 0.3s ease-in-out;
          font-family: 'Inter', sans-serif;
        }

        .react-calendar__navigation {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 0.8rem;
        }

        .react-calendar__navigation__label {
          flex: 1;
          text-align: center;
          font-weight: 700;
          font-size: 1rem;
          color: #111;
        }

        .react-calendar__navigation__prev-button,
        .react-calendar__navigation__next-button {
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #1f2937;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .react-calendar__navigation__prev-button:hover,
        .react-calendar__navigation__next-button:hover {
          background: #f3f4f6;
        }

        .react-calendar__month-view__weekdays {
          font-weight: 600;
          font-size: 0.8rem;
          color: #374151;
          text-align: center;
        }

        .react-calendar__month-view__days__day {
          font-size: 0.85rem !important;
          padding: 0.4rem 0 !important;
        }

        .available-day {
          background: #fff !important;
          color: #111 !important;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        .available-day:hover {
          background: #f2f2f2 !important;
        }
        .disabled-day {
          background: #f0f0f0 !important;
          color: #aaa !important;
          opacity: 0.5;
        }
        .past-day {
          background: #e9e9e9 !important;
          color: #999 !important;
          text-decoration: line-through;
        }

        @media (max-width: 768px) {
          .react-calendar { max-width: 90vw !important; font-size: 0.85rem !important; }
        }
      `}</style>
    </section>
  );
}
