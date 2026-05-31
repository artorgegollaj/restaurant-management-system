// Central role-based access rules for the admin app.
// Roles in the system: ADMIN, MANAGER, WAITER, USER.

export const ALL_LINKS = [
  ['/', 'Dashboard'],
  ['/users', 'Users'],
  ['/roles', 'Roles'],
  ['/menu-categories', 'Menu Categories'],
  ['/menu-items', 'Menu Items'],
  ['/tables', 'Tables'],
  ['/reservations', 'Reservations'],
  ['/orders', 'Orders'],
  ['/order-items', 'Order Items'],
  ['/staff', 'Staff'],
  ['/payments', 'Payments'],
  ['/reviews', 'Reviews'],
  ['/ingredients', 'Ingredients'],
];

// MANAGER gets everything except these.
const MANAGER_DENIED = ['/users', '/roles'];

// WAITER (employees) can only reach these.
const WAITER_ALLOWED = ['/menu-items', '/orders', '/reservations', '/tables'];

// A customer (or anyone without a staff role) gets only the public home page.
// Note: [].every(...) === true, so a role-less account is treated as a customer
// rather than being granted the staff area — and this avoids a redirect loop.
export function isUserOnly(roles = []) {
  return roles.every((r) => r === 'USER');
}

// The set of admin paths a user may open, based on their roles.
export function allowedPaths(roles = []) {
  if (roles.includes('ADMIN')) return ALL_LINKS.map(([p]) => p);
  const set = new Set();
  if (roles.includes('MANAGER')) {
    ALL_LINKS.forEach(([p]) => { if (!MANAGER_DENIED.includes(p)) set.add(p); });
  }
  if (roles.includes('WAITER')) {
    WAITER_ALLOWED.forEach((p) => set.add(p));
  }
  return [...set];
}

export function canAccess(path, roles = []) {
  return allowedPaths(roles).includes(path);
}

// Where to send a user after login / when they hit a page they can't open.
export function landingPath(roles = []) {
  if (isUserOnly(roles)) return '/home';
  const allowed = allowedPaths(roles);
  if (allowed.includes('/')) return '/';      // ADMIN, MANAGER -> Dashboard
  return allowed[0] || '/home';               // WAITER -> first allowed page
}
