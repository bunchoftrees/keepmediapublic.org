/**
 * Database exports for Keep Media Public (Supabase version)
 * This file previously exported better-sqlite3, now exports Supabase client
 */

import { supabase } from './supabase';

// Export the Supabase client as the default export
export default supabase;

// Re-export for convenience
export { supabase };

// No-op function for backward compatibility (not needed with Supabase)
export function initializeDatabase() {
  console.log('Using Supabase - database initialization not required');
}
