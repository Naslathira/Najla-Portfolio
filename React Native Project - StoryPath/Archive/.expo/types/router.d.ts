/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(drawer)` | `/(drawer)/` | `/(drawer)/profile` | `/(drawer)/projects` | `/_sitemap` | `/profile` | `/projects`;
      DynamicRoutes: `/project/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/project/[id]`;
    }
  }
}
