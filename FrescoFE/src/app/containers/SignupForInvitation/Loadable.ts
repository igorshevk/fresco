/**
 *
 * Asynchronously loads the component for SignupForInvitation
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SignupForInvitation = lazyLoad(
  () => import('./index'),
  module => module.SignupForInvitation,
);
