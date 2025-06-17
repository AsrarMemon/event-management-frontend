export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    venue_id: string;
    organizer_id: string;
    created_at: string;
    venue: Venue;
    organizer: Organizer;
    tags: string[];
}

export interface Venue {
    id: string;
    name: string;
    location: string;
}

export interface Organizer {
    id: string;
    name: string;
    contact: string;
}

export interface CreateEventRequest {
    title: string;
    description: string;
    date: string;
    venue_id: string;
    organizer_id: string;
    tags?: string[];
}

export interface EventsResponse {
    events: Event[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface EventFilters {
    search?: string;
    organizer?: string;
    venue?: string;
    tags?: string[];
    dateFrom?: string;
    dateTo?: string;
    sortBy?: 'title' | 'date' | 'venue' | 'organizer';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
