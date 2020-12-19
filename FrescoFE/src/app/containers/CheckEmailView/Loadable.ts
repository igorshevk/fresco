/**
 *
 * Asynchronously loads the component for CheckEmailView
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CheckEmailView = lazyLoad(
  () => import('./index'),
  module => module.CheckEmailView,
);
