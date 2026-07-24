import { defineBoolean, defineSecret, defineString } from 'firebase-functions/params';

/* ========================================================= *\
 *  Config Values                                            *
\* ========================================================= */

/**
 * Flag that specifies extra logging and more specific response errors.
 */
export const VERBOSE = defineBoolean('VERBOSE', {
  description: 'Flag that specifies extra logging, more specific response errors',
  default: false,
});

/**
 * API key for Ecoflow.
 */
export const ECOFLOW_ACCESS_KEY = defineString('ECOFLOW_ACCESS_KEY', {
  description: 'API key for Ecoflow',
});

/**
 * API token for Tempest weather.
 */
export const TEMPEST_ACCESS_TOKEN = defineString('TEMPEST_ACCESS_TOKEN', {
  description: 'API token for Tempest weather',
});

/**
 * Secret key for Ecoflow.
 */
export const ECOFLOW_SECRET_KEY = defineSecret('ECOFLOW_SECRET_KEY');

/**
 * API key for Gemini AI.
 */
export const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');
