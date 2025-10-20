// src/components/admin/CalendarAvailability.jsx
import { useState } from "react";

// helper: format YYYY-MM-DD
function fmt(d) {
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export default function CalendarAvailability({ onSave }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slotInput, setSlotInput] = useState(""); // ví dụ: "09:00, 10:30"

  const handleSaveThisDay = () => {
    if (!selectedDate) return;
    const cleanSlots = slotInput
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    // 🚩 luôn trả về dạng { date: "YYYY-MM-DD", slots: ["09:00","10:30"] }
    onSave({
      date: fmt(selectedDate),
      slots: cleanSlots
    });

    // optional: clear input nếu muốn
    // setSlotInput("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Calendar box — có thể là lib khác, demo đơn giản */}
      <div className="rounded-lg border p-4">
        <p className="font-medium mb-2">Pick a date</p>
        <input
          type="date"
          className="border rounded-md p-2"
          value={fmt(selectedDate)}
          onChange={(e) => {
            const [y, m, d] = e.target.value.split("-").map(Number);
            setSelectedDate(new Date(y, m - 1, d));
          }}
        />
      </div>

      {/* Time slots input */}
      <div className="rounded-lg border p-4">
        <p className="font-medium mb-2">Slots (comma separated)</p>
        <input
          type="text"
          placeholder="09:00, 10:30, 13:00"
          value={slotInput}
          onChange={(e) => setSlotInput(e.target.value)}
          className="w-full border rounded-md p-2"
        />

        <button
          onClick={handleSaveThisDay}
          className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          💾 Save This Day
        </button>
      </div>
    </div>
  );
}
