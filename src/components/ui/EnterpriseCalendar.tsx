import React, { useState } from 'react';

interface Event {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
}

interface EnterpriseCalendarProps {
  title?: string;
  events?: Event[];
}

const EnterpriseCalendar: React.FC<EnterpriseCalendarProps> = ({ title = 'Calendar', events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentDate(new Date());
    } else {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        if (direction === 'prev') {
          newDate.setMonth(newDate.getMonth() - 1);
        } else {
          newDate.setMonth(newDate.getMonth() + 1);
        }
        return newDate;
      });
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentDate);

  return (
    <div className="enterprise-calendar">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        {/* Header with month/year and navigation */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Previous
          </button>
          <h3 className="text-xl font-semibold">{monthYear}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => navigateMonth('today')}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-20"></div>;
            }

            const dayEvents = getEventsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={index}
                className={`h-20 border rounded p-1 cursor-pointer hover:bg-gray-50 ${
                  isToday ? 'bg-blue-50 border-blue-300' : ''
                } ${isSelected ? 'bg-blue-100 border-blue-500' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <div className="text-sm font-medium">{date.getDate()}</div>
                <div className="text-xs space-y-1 mt-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div key={event.id} className="bg-blue-200 rounded px-1 py-0.5 truncate">
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-gray-500">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Event details panel */}
        {selectedDate && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h4 className="font-semibold mb-2">
              Events for {selectedDate.toLocaleDateString()}
            </h4>
            {getEventsForDate(selectedDate).length > 0 ? (
              <div className="space-y-2">
                {getEventsForDate(selectedDate).map(event => (
                  <div key={event.id} className="bg-white p-3 rounded border">
                    <h5 className="font-medium">{event.title}</h5>
                    {event.startTime && event.endTime && (
                      <p className="text-sm text-gray-600">
                        {event.startTime} - {event.endTime}
                      </p>
                    )}
                    {event.location && (
                      <p className="text-sm text-gray-600">{event.location}</p>
                    )}
                    {event.description && (
                      <p className="text-sm text-gray-600">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No events scheduled</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnterpriseCalendar;
