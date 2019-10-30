import HomePageController from './controllers/HomePageController';

export const wrapRoutes = ebrcRoutes => [
    {path: '/', component: HomePageController},
  ...ebrcRoutes
];
