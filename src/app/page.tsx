'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { eventApi } from '@/lib/api';
import { EventFilters } from '@/types';
import EventTable from '@/components/EventTable';
import EventFiltersComponent from '@/components/EventFilters';
import Pagination from '@/components/Pagination';

export default function EventsPage() {
  const [filters, setFilters] = useState<EventFilters>({
    page: 1,
    limit: 10,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const { data: eventsData, isLoading, error } = useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventApi.getEvents(filters),
    retry: 3,
    retryDelay: 1000,
  });

  const { data: venues, error: venuesError } = useQuery({
    queryKey: ['venues'],
    queryFn: () => eventApi.getVenues(),
    retry: 3,
    retryDelay: 1000,
  });

  const { data: organizers, error: organizersError } = useQuery({
    queryKey: ['organizers'],
    queryFn: () => eventApi.getOrganizers(),
    retry: 3,
    retryDelay: 1000,
  });

  const handleFiltersChange = (newFilters: EventFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const uniqueVenues = venues ? [...new Set(venues.map(v => v.name))] : [];
  const uniqueOrganizers = organizers ? [...new Set(organizers.map(o => o.name))] : [];
  const uniqueTags = eventsData?.events
    ? [...new Set(eventsData.events.flatMap(e => e.tags))]
    : [];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600">Failed to load events. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Management</h1>
            <p className="mt-2 text-gray-600">
              Manage and organize your events with ease
            </p>
          </div>
          <Link
            href="/events/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Link>
        </div>

        <EventFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          organizers={uniqueOrganizers}
          venues={uniqueVenues}
          tags={uniqueTags}
        />

        <div className="bg-white rounded-lg shadow">
          <EventTable
            events={eventsData?.events || []}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isLoading={isLoading}
          />

          {eventsData && (
            <Pagination
              currentPage={eventsData.pagination.page}
              totalPages={eventsData.pagination.totalPages}
              totalItems={eventsData.pagination.total}
              itemsPerPage={eventsData.pagination.limit}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
