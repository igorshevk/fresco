/**
 *
 * Asynchronously loads the component for VerifyInvitation
 *
 */

import { lazyLoad } from 'utils/loadable';

export const VerifyInvitation = lazyLoad(
  () => import('./index'),
  module => module.VerifyInvitation,
);
