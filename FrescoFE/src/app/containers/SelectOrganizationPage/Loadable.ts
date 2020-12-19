/**
 *
 * Asynchronously loads the component for SelectOrganizationPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SelectOrganizationPage = lazyLoad(
  () => import('./index'),
  module => module.SelectOrganizationPage,
);
