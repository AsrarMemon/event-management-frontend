"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X } from "lucide-react";
import { eventApi } from "@/lib/api";
import { CreateEventRequest } from "@/types";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const eventId = params.id as string;

  const [formData, setFormData] = useState<CreateEventRequest>({
    title: "",
    description: "",
    date: "",
    venue_id: "",
    organizer_id: "",
    tags: [],
  });

  const [currentTag, setCurrentTag] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventApi.getEvent(eventId),
    enabled: !!eventId,
  });

  const { data: venues = [] } = useQuery({
    queryKey: ["venues"],
    queryFn: () => eventApi.getVenues(),
  });

  const { data: organizers = [] } = useQuery({
    queryKey: ["organizers"],
    queryFn: () => eventApi.getOrganizers(),
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().slice(0, 16),
        venue_id: event.venue_id.toString(),
        organizer_id: event.organizer_id.toString(),
        tags: event.tags || [],
      });
    }
  }, [event]);

  const updateEventMutation = useMutation({
    mutationFn: (eventData: Partial<CreateEventRequest>) =>
      eventApi.updateEvent(eventId, eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      router.push(`/events/${eventId}`);
    },
    onError: (error: any) => {
      console.error("Failed to update event:", error);

      let errorMessage = "Failed to update event. Please try again.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setErrors({ submit: errorMessage });
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.venue_id) {
      newErrors.venue_id = "Venue is required";
    } else {
      const venueExists = venues.some(
        (venue) => venue.id.toString() === formData.venue_id
      );
      if (!venueExists) {
        newErrors.venue_id = "Please select a valid venue";
      }
    }

    if (!formData.organizer_id) {
      newErrors.organizer_id = "Organizer is required";
    } else {
      const organizerExists = organizers.some(
        (organizer) => organizer.id.toString() === formData.organizer_id
      );
      if (!organizerExists) {
        newErrors.organizer_id = "Please select a valid organizer";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      updateEventMutation.mutate(formData);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags?.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Event not found
          </h2>
          <p className="text-gray-600 mb-4">
            The event you're trying to edit doesn't exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Link
            href={`/events/${eventId}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Event
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Edit Event</h1>
            <p className="text-green-100 mt-2">
              Update the event details below
            </p>
          </div>

          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {errors.submit && (
                <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{errors.submit}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Event Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-black placeholder-gray-500 ${
                        errors.title
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                      placeholder="Enter an engaging event title"
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="w-4 h-4 mr-1">⚠️</span>
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={5}
                      value={formData.description}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none text-black placeholder-gray-500 ${
                        errors.description
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                      placeholder="Describe your event in detail..."
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="w-4 h-4 mr-1">⚠️</span>
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-black ${
                        errors.date
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    />
                    {errors.date && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="w-4 h-4 mr-1">⚠️</span>
                        {errors.date}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="venue_id"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Venue *
                    </label>
                    <select
                      id="venue_id"
                      name="venue_id"
                      value={formData.venue_id}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-black ${
                        errors.venue_id
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <option value="">🏢 Select a venue</option>
                      {venues.map((venue) => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name} - {venue.location}
                        </option>
                      ))}
                    </select>
                    {errors.venue_id && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="w-4 h-4 mr-1">⚠️</span>
                        {errors.venue_id}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="organizer_id"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Organizer *
                    </label>
                    <select
                      id="organizer_id"
                      name="organizer_id"
                      value={formData.organizer_id}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-black ${
                        errors.organizer_id
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <option value="">👤 Select an organizer</option>
                      {organizers.map((organizer) => (
                        <option key={organizer.id} value={organizer.id}>
                          {organizer.name} - {organizer.contact}
                        </option>
                      ))}
                    </select>
                    {errors.organizer_id && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="w-4 h-4 mr-1">⚠️</span>
                        {errors.organizer_id}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="tags"
                      className="block text-sm font-semibold text-gray-900 mb-2"
                    >
                      Tags
                      <span className="text-gray-500 font-normal">
                        (optional)
                      </span>
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={handleTagKeyPress}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white hover:border-gray-300 text-black placeholder-gray-500"
                        placeholder="Add a tag and press Enter"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-2 hover:text-red-600 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                <Link
                  href={`/events/${eventId}`}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={updateEventMutation.isPending}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  {updateEventMutation.isPending ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating Event...
                    </span>
                  ) : (
                    "💾 Update Event"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
