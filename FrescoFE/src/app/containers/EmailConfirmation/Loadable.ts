/**
 *
 * Asynchronously loads the component for EmailConfirmation
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EmailConfirmation = lazyLoad(
  () => import('./index'),
  module => module.EmailConfirmation,
);
