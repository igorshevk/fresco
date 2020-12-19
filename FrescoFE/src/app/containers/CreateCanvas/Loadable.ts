/**
 *
 * Asynchronously loads the component for Dashboard
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CreateCanvas = lazyLoad(
  () => import('./index'),
  module => module.CreateCanvas,
);
