import { createClient } from '@supabase/supabase-js';
import env from './env';
import logger from './logger';

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Test connection on startup
supabase
  .from('_health')
  .select('*')
  .limit(1)
  .then(() => {
    logger.info('Supabase connection established');
  })
  .catch((error) => {
    logger.warn({ error }, 'Supabase connection test failed (this is normal if _health table does not exist)');
  });

export default supabase;

