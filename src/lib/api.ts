import { CreateEventRequest, Event, EventFilters, EventsResponse, Organizer, Venue } from '@/types';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const eventApi = {
    getEvents: async (filters: EventFilters = {}): Promise<EventsResponse> => {
        const params = new URLSearchParams();

        if (filters.search) params.append('search', filters.search);
        if (filters.organizer) params.append('organizer', filters.organizer);
        if (filters.venue) params.append('venue', filters.venue);
        if (filters.tags?.length) params.append('tags', filters.tags.join(','));
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.append('dateTo', filters.dateTo);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get(`/events?${params.toString()}`);
        return {
            events: response.data.events || response.data.data || [],
            pagination: response.data.pagination || {
                page: 1,
                limit: 10,
                total: 0,
                totalPages: 0
            }
        };
    },
    getEvent: async (id: string): Promise<Event> => {
        const response = await api.get(`/events/${id}`);
        return response.data.data || response.data;
    },
    createEvent: async (event: CreateEventRequest): Promise<Event> => {
        const venue_id = parseInt(event.venue_id);
        const organizer_id = parseInt(event.organizer_id);

        if (isNaN(venue_id) || isNaN(organizer_id)) {
            throw new Error('Invalid venue or organizer ID');
        }

        const eventData = {
            ...event,
            venue_id,
            organizer_id
        };

        try {
            const response = await api.post('/events', eventData);
            return response.data.data || response.data;
        } catch (error: any) {
            throw error;
        }
    },
    updateEvent: async (id: string, event: Partial<CreateEventRequest>): Promise<Event> => {
        const eventData = {
            ...event,
            ...(event.venue_id && { venue_id: parseInt(event.venue_id) }),
            ...(event.organizer_id && { organizer_id: parseInt(event.organizer_id) })
        };

        const response = await api.put(`/events/${id}`, eventData);
        return response.data.data || response.data;
    },
    getVenues: async (): Promise<Venue[]> => {
        const response = await api.get('/venues');
        return response.data.data || response.data;
    },

    getOrganizers: async (): Promise<Organizer[]> => {
        const response = await api.get('/organizers');
        return response.data.data || response.data;
    },
};

export default api;
