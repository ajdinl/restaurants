import type { CurrentUser, User } from '@/types/api';

// Mirrors the API's Pundit policies so the UI hides what the API would refuse anyway.
// The API stays the source of truth.

type Actor = Pick<CurrentUser, 'id' | 'platform_role'>;

export function isPlatformStaff(user: Actor): boolean {
    return user.platform_role !== null;
}

export function canDeleteRestaurant(user: Actor): boolean {
    return user.platform_role === 'super_admin';
}

export function canEditUser(actor: Actor, target: Pick<User, 'platform_role'>): boolean {
    return (
        actor.platform_role === 'super_admin' || (actor.platform_role === 'moderator' && target.platform_role === null)
    );
}

export function canDeleteUser(actor: Actor, target: Pick<User, 'id'>): boolean {
    return actor.platform_role === 'super_admin' && actor.id !== target.id;
}

export function canAssignPlatformRole(actor: Actor, target?: Pick<User, 'id'>): boolean {
    return actor.platform_role === 'super_admin' && target?.id !== actor.id;
}
