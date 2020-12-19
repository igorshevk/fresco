/**
 *
 * Asynchronously loads the component for WelcomePage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const WelcomePage = lazyLoad(
  () => import('./index'),
  module => module.WelcomePage,
);
