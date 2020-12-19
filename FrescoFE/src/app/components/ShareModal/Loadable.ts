/**
 *
 * Asynchronously loads the component for ShareModal
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ShareModal = lazyLoad(
  () => import('./index'),
  module => module.ShareModal,
);
