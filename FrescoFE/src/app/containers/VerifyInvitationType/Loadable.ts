/**
 *
 * Asynchronously loads the component for VerifyInvitation
 *
 */

import { lazyLoad } from 'utils/loadable';

export const VerifyInvitationType = lazyLoad(
  () => import('./index'),
  module => module.VerifyInvitationType,
);
