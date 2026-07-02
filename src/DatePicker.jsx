import React from 'react';


const CUR_YEAR = new Date().getFullYear();
const CUR_MONTH = new Date().getMonth() + 1;
const YEARS_RANGE = 21;
const CUR_YEAR_OFFSET = 10;
const MONTHS_IN_YEAR = 12;
const DAYS_IN_WEEK = 7;
const LAST_DAY_OF_WEEK_INDEX = 6;
const DAYS_OF_THE_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getMonthName = (index) =>
  new Date(0, index).toLocaleString('default', { month: 'long' });

const generateYearOptions = (year) =>
  Array.from({ length: YEARS_RANGE }).map((_, i) => ({
    value: year - CUR_YEAR_OFFSET + i,
  }));

const generateMonthOptions = () =>
  Array.from({ length: MONTHS_IN_YEAR }).map((_, i) => ({
    value: i + 1,
    label: getMonthName(i),
  }));

// Converts JS's Sunday-first (0-6) day index into a Monday-first (0-6) index
const adjustDayOfWeek = (day) => {
  if (day === 0) day = 7;
  return day - 1;
};

const pad = (n) => String(n).padStart(2, '0');
const formatDate = (year, month, date) =>
  `${year}-${pad(month)}-${pad(date)}`;

const createCalendar = (year, month, selectedDate, onSelectDate) => {
  const day = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const rows = [];
  let cells = [];

  // leading blank cells so the 1st lines up under the correct weekday
  for (let i = 0; i < adjustDayOfWeek(day.getDay()); i++) {
    cells.push(<td key={`empty-${i}`}></td>);
  }

  while (day.getMonth() === month - 1) {
    const date = day.getDate();
    const isSelected = selectedDate === formatDate(year, month, date);

    cells.push(
      <td
        key={date}
        onClick={() => onSelectDate(date)}
        style={{
          cursor: 'pointer',
          textAlign: 'center',
          padding: '6px',
          fontWeight: isSelected ? 'bold' : 'normal',
          background: isSelected ? '#dbeafe' : 'transparent',
          borderRadius: '4px',
        }}
      >
        {date}
      </td>
    );

    const dayOfWeek = adjustDayOfWeek(day.getDay());
    if (dayOfWeek === LAST_DAY_OF_WEEK_INDEX || date === daysInMonth) {
      // pad the final week out to 7 cells so the table stays aligned
      while (cells.length < DAYS_IN_WEEK) {
        cells.push(<td key={`trailing-${cells.length}`}></td>);
      }
      rows.push(<tr key={date}>{cells}</tr>);
      cells = [];
    }

    day.setDate(date + 1);
  }

  return (
    <table>
      <thead>
        <tr>
          {DAYS_OF_THE_WEEK.map((dayName) => (
            <th key={dayName}>{dayName}</th>
          ))}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

function DatePicker({onDateSelected}) {
  const [year, setYear] = React.useState(CUR_YEAR);
  const [month, setMonth] = React.useState(CUR_MONTH);
  const [selectedDate, setSelectedDate] = React.useState('');

  const onHandleSelectedDate = (date) => {
    const formatted = formatDate(month, date, year);
    setSelectedDate(formatted);
    onDateSelected?.(formatted);
  };

  return (
    <div>
      <label htmlFor="year">Year:</label>
      <select
        id="year"
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
      >
        {generateYearOptions(CUR_YEAR).map(({ value }) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>

      <label htmlFor="month">Month:</label>
      
      <select
        id="month"
        value={month}
        onChange={(e) => setMonth(Number(e.target.value))}
      >
        {generateMonthOptions().map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
     <input type="text" readOnly placeholder="Selected date" value={selectedDate} />

      {createCalendar(year, month, selectedDate, onHandleSelectedDate)}
    </div>
  );
}

export default DatePicker;



function ControlledComponent() {
  const [value, setValue] = React.useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker value={value} onChange={(newValue) => setValue(newValue)} />
      </DemoContainer>
    </LocalizationProvider>
  );
}