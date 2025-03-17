import { DateRangePicker, DateRange } from "mui-daterange-picker";
import { useCallback, useState } from "react";

import TextField from "@mui/material/TextField";

import { fDate, getYearBackDateFromToday } from "@/libs/utils/time";

import styles from "./index.module.css";

const maxDate = new Date();

const DateRangeSelector = ({
  dateRange,
  setDateRange,
}: {
  dateRange: DateRange;
  setDateRange: (dateRange: DateRange) => void;
}) => {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const handleChange = useCallback(
    (range: DateRange) => {
      setDateRange(range);
    },
    [setDateRange]
  );

  return (
    <>
      <TextField
        name="dateRange"
        value={`${fDate(dateRange.startDate, "dd-MMM-yy")} - ${fDate(
          dateRange.endDate,
          "dd-MMM-yy"
        )}`}
        disabled={open}
        onClick={toggle}
        sx={{ minWidth: "208px" }}
      />
      {open && (
        <DateRangePicker
          open={open}
          toggle={toggle}
          onChange={handleChange}
          closeOnClickOutside
          minDate={getYearBackDateFromToday(1)}
          maxDate={maxDate}
          wrapperClassName={styles.holder}
          initialDateRange={dateRange}
        />
      )}
    </>
  );
};

export default DateRangeSelector;
