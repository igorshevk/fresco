/**
 *
 * Asynchronously loads the component for ListOrganizations
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ListOrganizations = lazyLoad(
  () => import('./index'),
  module => module.ListOrganizations,
);
