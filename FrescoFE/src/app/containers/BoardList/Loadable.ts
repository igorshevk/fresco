/**
 *
 * Asynchronously loads the component for BoardList
 *
 */

import { lazyLoad } from 'utils/loadable';

export const BoardList = lazyLoad(
  () => import('./index'),
  module => module.BoardList,
);
