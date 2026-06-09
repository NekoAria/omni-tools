import { defineTool } from '@tools/defineTool';
import { lazy } from 'react';

export const tool = defineTool('list', {
  path: 'list-difference',
  icon: 'ic:twotone-difference',
  keywords: ['list', 'difference', 'compare', 'lines', 'diff'],
  component: lazy(() => import('./index')),
  i18n: {
    name: 'list:listDifference.title',
    description: 'list:listDifference.description',
    shortDescription: 'list:listDifference.shortDescription',
    longDescription: 'list:listDifference.longDescription',
    userTypes: ['generalUsers', 'developers']
  }
});
