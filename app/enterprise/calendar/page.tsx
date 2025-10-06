'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Suspense } from 'react';
import Calendar from '../../../src/components/enterprise/Calendar';
import Skeleton from '@/components/ui/Skeleton';
import { Plus } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  attendees?: string[];
  color?: string;
  location?: string;
  allDay: boolean;
}

import { TypedSupabaseClient } from '../../../src/types';

async function fetchCalendarEvents(supabase: TypedSupabaseClient): Promise<CalendarEvent[]> {
  // Fetch events from Supabase (assume 'events' table with fields: title, start, end, description, attendees (json), color, location, all_day)
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('start', new Date().toISOString())
    .order('start', { ascending: true });

  if (error) throw error;

  if (!data || data.length === 0) {
    throw new Error('No calendar events found');
  }

  // Map data to CalendarEvent
  return data.map((item) => ({
    id: item.id,
    title: item.title,
    start: item.start,
    end: item.end,
    description: item.description,
    attendees: item.attendees || [],
    color: item.color || '#3b82f6',
    location: item.location,
    allDay: item.all_day || false,
  }));
}

const CalendarContent = () => {
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: () => fetchCalendarEvents(supabase),
  });

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading calendar: {error.message}</p>
      </div>
    );
  }

  const handleEventClick = (event: any) => {
    // Handle event click, e.g., open modal or navigate to event details
    console.log('Clicked event:', event.id);
    alert(`Opening event ${event.id}`);
  };

  const handleEventAdd = async (date: Date) => {
    // Add new event to Supabase
    const newEvent = {
      title: 'New Event',
      start: date.toISOString(),
      end: new Date(date.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour later
      description: '',
      attendees: [],
      color: '#3b82f6',
      location: '',
      allDay: false,
    };

    const { error } = await supabase
      .from('events')
      .insert({
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        description: newEvent.description,
        attendees: newEvent.attendees,
        color: newEvent.color,
        location: newEvent.location,
        all_day: newEvent.allDay,
      });

    if (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event');
    } else {
      // Invalidate query to refetch
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      alert('Event added successfully!');
    }
  };

  const handleDateChange = (date: Date) => {
    // Handle date change, e.g., filter events or navigate
    console.log('Date changed to:', date);
  };

  if (isLoading) {
    return <CalendarLoading />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Company Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Schedule and manage team events</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </button>
        </div>
      </div>

      <Suspense fallback={<CalendarLoading />}>
        <Calendar
          events={(events || []).map(event => ({
            id: event.id,
            title: event.title,
            date: new Date(event.start),
            startTime: event.allDay ? undefined : new Date(event.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            endTime: event.allDay ? undefined : new Date(event.end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            location: event.location,
            description: event.description,
            color: event.color,
            allDay: event.allDay,
          }))}
          onEventClick={handleEventClick}
          onEventAdd={handleEventAdd}
          onDateChange={handleDateChange}
          title="Team Calendar"
        />
      </Suspense>
    </div>
  );
};

const CalendarLoading = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-64" />
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 42 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  </div>
);

export default function CalendarPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading calendar...</div>}>
      <CalendarContent />
    </Suspense>
  );
}
