import { defineTool } from '@tools/defineTool';
import { lazy } from 'react';

export const tool = defineTool('list', {
  path: 'list-intersection',
  icon: 'mdi:set-center',
  keywords: ['list', 'intersection', 'compare', 'lines', 'common'],
  component: lazy(() => import('./index')),
  i18n: {
    name: 'list:listIntersection.title',
    description: 'list:listIntersection.description',
    shortDescription: 'list:listIntersection.shortDescription',
    longDescription: 'list:listIntersection.longDescription',
    userTypes: ['generalUsers', 'developers']
  }
});
