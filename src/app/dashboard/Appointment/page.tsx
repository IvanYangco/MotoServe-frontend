"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Schedule {
  scheduleId: number;
  date: string;
  time: string;
  mechanic: { mechanicId: number; firstname: string; lastname: string } | null;
}

interface Mechanic {
  mechanicId: number;
  firstname: string;
  lastname: string;
}

export default function AppointmentPage() {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [mechanicId, setMechanicId] = useState(0);
  const [message, setMessage] = useState("");
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:5043/api/Mechanic")
      .then(res => res.json())
      .then(data =>
        setMechanics(
          data.map((m: any) => ({
            mechanicId: m.MechanicId,
            firstname: m.Firstname,
            lastname: m.Lastname,
          }))
        )
      );

    fetchSchedules();
  }, []);

  useEffect(() => {
    if (selectedDate && mechanicId) {
      fetchSchedules();
    }
  }, [selectedDate, mechanicId]);

  const fetchSchedules = () => {
    fetch("http://localhost:5043/api/MaintenanceSchedule")
      .then(res => res.json())
      .then((data: any[]) => {
        const mapped: Schedule[] = data.map((s: any) => ({
          scheduleId: s.ScheduleId,
          date: s.Date,
          time: s.Time,
          mechanic: s.Mechanic
            ? {
                mechanicId: s.Mechanic.MechanicId,
                firstname: s.Mechanic.Firstname,
                lastname: s.Mechanic.Lastname,
              }
            : null,
        }));

        setSchedules(mapped);

        if (selectedDate && mechanicId) {
          const yyyy = selectedDate.toISOString().split("T")[0];
          const taken = mapped
            .filter((s: Schedule) => s.date === yyyy && s.mechanic?.mechanicId === mechanicId)
            .map((s: Schedule) => s.time);

          setBookedTimes(taken);
        }
      })
      .catch(() => setSchedules([]));
  };

  const createSchedule = async () => {
    if (!selectedDate || !time || !mechanicId) {
      setMessage("Please fill all fields.");
      return;
    }

    const body = {
      date: selectedDate.toISOString().split("T")[0],
      time,
      mechanicId,
    };

    const res = await fetch("http://localhost:5043/api/MaintenanceSchedule/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setMessage("Schedule created successfully!");
      fetchSchedules();
      setTime("");
    } else {
      setMessage(await res.text());
    }
  };

  return (
    <div className="p-6 space-y-6 text-gray-800">
      <h1 className="text-3xl font-bold">Appointment</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold">Create Schedule</h2>

        <DatePicker
          selected={selectedDate}
          onChange={setSelectedDate}
          className="border p-2 rounded w-full"
          placeholderText="Select Date"
        />

        <select className="border p-2 rounded w-full" onChange={(e) => setMechanicId(Number(e.target.value))}>
          <option value={0}>Select Mechanic</option>
          {mechanics.map(m => (
            <option key={m.mechanicId} value={m.mechanicId}>
              {m.firstname} {m.lastname}
            </option>
          ))}
        </select>

        <input
          type="time"
          className="border p-2 rounded w-full"
          disabled={!mechanicId || !selectedDate}
          onChange={(e) => setTime(e.target.value)}
          list="time-list"
        />

        <datalist id="time-list">
          {Array.from({ length: 10 }, (_, i) => {
            const hour = 8 + i;
            const timeStr = `${hour.toString().padStart(2, "0")}:00`;
            return bookedTimes.includes(timeStr) ? null : (
              <option key={timeStr} value={timeStr} />
            );
          })}
        </datalist>

        <button onClick={createSchedule} className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Appointment
        </button>

        {message && <p className="text-red-600 mt-2">{message}</p>}
      </div>

      {/* 📋 SHOW SCHEDULES */}
<div>
  <h2 className="text-xl font-semibold">Current Appointments</h2>
  <table className="min-w-full mt-4 bg-white rounded shadow text-gray-800">
    <thead>
      <tr className="bg-gray-200 text-center">
        <th className="p-3">Date</th>
        <th className="p-3">Time</th>
        <th className="p-3">Mechanic</th>
      </tr>
    </thead>
    <tbody>
      {schedules.map((s, index) => (
        <tr key={s.scheduleId || index} className="border-t text-center">
          <td className="p-3">{s.date}</td>
          <td className="p-3">{s.time}</td>
          <td className="p-3 font-medium">
            {s.mechanic
              ? `${s.mechanic.firstname} ${s.mechanic.lastname}`
              : "—"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
}
