import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema({
  title: { type: String },
  start: { type: String },
  end: { type: String },
  allDay: { type: String },
});

const Calendar = mongoose.model("calendar", calendarSchema);

export default Calendar;
