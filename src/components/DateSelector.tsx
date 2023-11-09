import { MobileDatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import React from "react";

interface Props {
  onChange: (date: Dayjs | null) => void;
  date: Dayjs | null;
}
const last30Days = dayjs().subtract(30, "d");
const DateSelector: React.FC<Props> = ({ onChange, date }) => {
  return (
    <MobileDatePicker
      label="Choose a date"
      value={date}
      onAccept={onChange}
      disableFuture
      shouldDisableDate={date => date.isBefore(last30Days)}
    />
  );
};
export default DateSelector;
