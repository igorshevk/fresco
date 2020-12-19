/**
 *
 * Asynchronously loads the component for CreateBoard
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CreateBoard = lazyLoad(
  () => import('./index'),
  module => module.CreateBoard,
);
