import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  Route,
  RouteReuseStrategy,
} from '@angular/router';

@Injectable()
export class CustomReuseStrategy extends RouteReuseStrategy {
  private pool = new WeakMap<Route, DetachedRouteHandle>();

  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!this.pool.get(route.routeConfig);
  }

  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return this.pool.get(route.routeConfig);
  }

  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return (
      route.routeConfig.data?.shouldReuse && !this.pool.get(route.routeConfig)
    );
  }

  public store(
    route: ActivatedRouteSnapshot,
    handle: DetachedRouteHandle | null
  ) {
    this.pool.set(route.routeConfig, handle);
  }

  public shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
