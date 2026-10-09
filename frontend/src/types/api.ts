export type Locale = 'bs' | 'en';
export type PlatformRole = 'super_admin' | 'moderator';
export type MembershipRole = 'owner' | 'manager' | 'host' | 'waiter' | 'kitchen';
export type RestaurantStatus = 'active' | 'suspended';

export const MEMBERSHIP_ROLES: MembershipRole[] = ['owner', 'manager', 'host', 'waiter', 'kitchen'];
export const PLATFORM_ROLES: PlatformRole[] = ['super_admin', 'moderator'];

export interface ApiError {
    field: string | null;
    message: string;
}

export interface PageMeta {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
}

export interface CurrentUser {
    id: string;
    email: string;
    full_name: string;
    platform_role: PlatformRole | null;
    locale: Locale | null;
    memberships: {
        id: string;
        role: MembershipRole;
        restaurant: { id: string; slug: string; name: string; status: RestaurantStatus };
    }[];
}

export interface Restaurant {
    id: string;
    name: string;
    slug: string;
    status: RestaurantStatus;
    address: string | null;
    city: string | null;
    phone: string | null;
    email: string | null;
    latitude: string | null;
    longitude: string | null;
    time_zone: string;
    has_host: boolean;
    created_at: string;
}

export interface Membership {
    id: string;
    role: MembershipRole;
    active: boolean;
    user: { id: string; full_name: string; email: string };
}

export interface User {
    id: string;
    email: string;
    full_name: string;
    platform_role: PlatformRole | null;
    locale: Locale | null;
    created_at: string;
    locked: boolean;
}

export interface AdminDashboard {
    restaurants: { total: number; active: number; suspended: number };
    users: number;
}

export interface WorkspaceDashboard {
    restaurant: Restaurant;
    role: MembershipRole | null;
    support_view: boolean;
}
