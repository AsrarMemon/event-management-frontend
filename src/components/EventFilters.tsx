"use client";

import { useState, useEffect } from "react";
import { EventFilters } from "@/types";
import { Search, Filter, X } from "lucide-react";

interface EventFiltersProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
  organizers: string[];
  venues: string[];
  tags: string[];
}

export default function EventFiltersComponent({
  filters,
  onFiltersChange,
  organizers,
  venues,
  tags,
}: EventFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...localFilters, search: e.target.value, page: 1 };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleFilterChange = (key: keyof EventFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value, page: 1 };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: EventFilters = { page: 1, limit: 10 };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters =
    localFilters.search ||
    localFilters.organizer ||
    localFilters.venue ||
    localFilters.tags?.length ||
    localFilters.dateFrom ||
    localFilters.dateTo;

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />{" "}
            <input
              type="text"
              placeholder="Search events..."
              value={localFilters.search || ""}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-500"
            />
          </div>
        </div>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center text-black space-x-2 px-4 py-2 border rounded-md transition-colors ${
            hasActiveFilters
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {isFilterOpen && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organizer
            </label>{" "}
            <select
              value={localFilters.organizer || ""}
              onChange={(e) =>
                handleFilterChange("organizer", e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
            >
              <option value="">All Organizers</option>
              {organizers.map((organizer) => (
                <option key={organizer} value={organizer}>
                  {organizer}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Venue
            </label>{" "}
            <select
              value={localFilters.venue || ""}
              onChange={(e) =>
                handleFilterChange("venue", e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
            >
              <option value="">All Venues</option>
              {venues.map((venue) => (
                <option key={venue} value={venue}>
                  {venue}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date From
            </label>{" "}
            <input
              type="date"
              value={localFilters.dateFrom || ""}
              onChange={(e) =>
                handleFilterChange("dateFrom", e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date To
            </label>{" "}
            <input
              type="date"
              value={localFilters.dateTo || ""}
              onChange={(e) =>
                handleFilterChange("dateTo", e.target.value || undefined)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const currentTags = localFilters.tags || [];
                    const newTags = currentTags.includes(tag)
                      ? currentTags.filter((t) => t !== tag)
                      : [...currentTags, tag];
                    handleFilterChange(
                      "tags",
                      newTags.length ? newTags : undefined
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    localFilters.tags?.includes(tag)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
