import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import Button from './Button';
import Card from './Card';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  color?: string;
  allDay?: boolean;
}

interface EnterpriseCalendarProps {
  events?: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onEventAdd?: (date: Date) => void;
  onDateChange?: (date: Date) => void;
  className?: string;
  title?: string;
  showNavigation?: boolean;
  showEventDetails?: boolean;
}

const EnterpriseCalendar: React.FC<EnterpriseCalendarProps> = ({
  events = [],
  onEventClick,
  onEventAdd,
  onDateChange,
  className = '',
  title = 'Calendar',
  showNavigation = true,
  showEventDetails = true
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getColorClass = (color: string = 'blue') => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      pink: 'bg-pink-500',
      indigo: 'bg-indigo-500'
    };
    return colorMap[color] || colorMap.blue;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Previous month's days
    const prevMonth = new Date(year, month - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());
    
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push(
        <div 
          key={`prev-${day}`} 
          className="p-2 text-center text-gray-400 dark:text-gray-500 text-sm"
        >
          {day}
        </div>
      );
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayEvents = getEventsForDate(date);
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      const isCurrentDay = isToday(date);
      
      days.push(
        <motion.div
          key={`current-${day}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            p-2 h-24 border border-gray-200 dark:border-gray-700 cursor-pointer transition-colors
            ${isSelected ? 'bg-accent/10' : ''}
            ${isCurrentDay ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
          `}
          onClick={() => {
            setSelectedDate(date);
            if (onEventAdd) {
              onEventAdd(date);
            }
          }}
        >
          <div className={`text-right text-sm ${isCurrentDay ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
            {day}
          </div>
          <div className="mt-1 space-y-1 max-h-16 overflow-y-auto">
            {dayEvents.slice(0, 3).map(event => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded truncate text-white ${getColorClass(event.color)}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEventClick) {
                    onEventClick(event);
                  }
                }}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                +{dayEvents.length - 3} more
              </div>
            )}
          </div>
        </motion.div>
      );
    }
    
    // Next month's days
    const totalCells = 42; // 6 rows * 7 days
    
    for (let day = 1; day <= totalCells - days.length; day++) {
      days.push(
        <div 
          key={`next-${day}`} 
          className="p-2 text-center text-gray-400 dark:text-gray-500 text-sm"
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className={className}>
      <Card className="p-6" variant="feature">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-accent focus:border-accent"
              />
            </div>
            
            <Button variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>
              Filter
            </Button>
            
            {onEventAdd && (
              <Button 
                variant="primary" 
                size="sm" 
                icon={<Plus className="w-4 h-4" />}
                onClick={() => onEventAdd(new Date())}
              >
                Add Event
              </Button>
            )}
          </div>
        </div>
        
        {/* Calendar Navigation */}
        {showNavigation && (
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              icon={<ChevronLeft className="w-4 h-4" />}
              onClick={() => navigateMonth('prev')}
            >
              Previous
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              icon={<CalendarIcon className="w-4 h-4" />}
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              icon={<ChevronRight className="w-4 h-4" />}
              onClick={() => navigateMonth('next')}
            >
              Next
            </Button>
          </div>
        )}
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div 
              key={day} 
              className="p-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800"
            >
              {day}
            </div>
          ))}
          {renderCalendarDays()}
        </div>
      </Card>
      
      {/* Event Details Panel */}
      {showEventDetails && selectedDate && (
        <Card className="mt-6 p-6" variant="feature">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Events for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedDateEvents.length} events
            </span>
          </div>
          
          {selectedDateEvents.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                No events scheduled for this day
              </p>
              {onEventAdd && (
                <Button 
                  variant="primary" 
                  className="mt-4" 
                  onClick={() => onEventAdd(selectedDate)}
                >
                  Add Event
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateEvents.map(event => (
                <div 
                  key={event.id} 
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                  onClick={() => onEventClick && onEventClick(event)}
                >
                  <div className="flex items-start">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${getColorClass(event.color)}`}></div>
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                      <div className="mt-1 space-y-1">
                        {event.allDay ? (
                          <p className="text-sm text-gray-600 dark:text-gray-400">All day</p>
                        ) : (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                      {event.description && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default EnterpriseCalendar;
export type { CalendarEvent };
