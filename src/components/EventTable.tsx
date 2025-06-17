"use client";

import { Event, EventFilters } from "@/types";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Edit, Eye } from "lucide-react";
import Link from "next/link";

interface EventTableProps {
  events: Event[];
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
  isLoading?: boolean;
}

export default function EventTable({
  events,
  filters,
  onFiltersChange,
  isLoading,
}: EventTableProps) {
  const handleSort = (field: "title" | "date" | "venue" | "organizer") => {
    const isCurrentField = filters.sortBy === field;
    const newOrder =
      isCurrentField && filters.sortOrder === "asc" ? "desc" : "asc";

    onFiltersChange({
      ...filters,
      sortBy: field,
      sortOrder: newOrder,
    });
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (filters.sortBy !== field)
      return <ChevronUp className="w-4 h-4 opacity-30" />;
    return filters.sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="animate-pulse">
          <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-t-xl mb-1"></div>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 border-b border-gray-200 last:border-b-0 flex items-center px-6"
            >
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center space-x-1">
                  <span>Title</span>
                  <SortIcon field="title" />
                </div>
              </th>
              <th
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <SortIcon field="date" />
                </div>
              </th>
              <th
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("venue")}
              >
                <div className="flex items-center space-x-1">
                  <span>Venue</span>
                  <SortIcon field="venue" />
                </div>
              </th>
              <th
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("organizer")}
              >
                <div className="flex items-center space-x-1">
                  <span>Organizer</span>
                  <SortIcon field="organizer" />
                </div>
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {event.title}
                  </div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {event.description}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(event.date), "MMM dd, yyyy HH:mm")}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {event.venue.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {event.venue.location}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {event.organizer.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {event.organizer.contact}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      href={`/events/${event.id}`}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/events/${event.id}/edit`}
                      className="text-green-600 hover:text-green-900 flex items-center"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-gray-50">
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg font-medium">No events found</p>
              <p className="text-sm">
                Try adjusting your search criteria or create a new event.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
