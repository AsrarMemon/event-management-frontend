"use client";

import { eventApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Edit, MapPin, Tag, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id as string;

  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventApi.getEvent(eventId),
    enabled: !!eventId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Event not found
          </h2>
          <p className="text-gray-600 mb-4">
            The event you're looking for doesn't exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  if (!event) return null;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
          <Link
            href={`/events/${event.id}/edit`}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Event
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white">
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <p className="text-blue-100 text-lg leading-relaxed max-w-3xl">
              {event.description}
            </p>
          </div>

          <div className="px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Event Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <div className="w-16 text-sm font-medium">Date:</div>
                      <span className="text-gray-900">
                        {format(new Date(event.date), "EEEE, MMMM do, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <div className="w-16 text-sm font-medium">Time:</div>
                      <span className="text-gray-900">
                        {format(new Date(event.date), "h:mm a")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-green-600" />
                    Venue Information
                  </h3>
                  <div className="space-y-2">
                    <div className="font-medium text-gray-900">
                      {event.venue.name}
                    </div>
                    <div className="text-gray-600">{event.venue.location}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-purple-600" />
                    Organizer
                  </h3>
                  <div className="space-y-2">
                    <div className="font-medium text-gray-900">
                      {event.organizer.name}
                    </div>
                    <div className="text-gray-600">
                      {event.organizer.contact}
                    </div>
                  </div>
                </div>
                {event.tags && event.tags.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Tag className="w-5 h-5 mr-2 text-orange-600" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Event created:</span>
                {format(
                  new Date(event.created_at),
                  "MMMM dd, yyyy 'at' h:mm a"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
