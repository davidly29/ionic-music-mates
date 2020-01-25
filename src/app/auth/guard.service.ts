import { Injectable } from '@angular/core';
import {AuthService} from './auth.service';
import {Route, Router, UrlSegment} from '@angular/router';
import {Observable} from 'rxjs';
import {take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor(private authService: AuthService, private route: Router) { }

  canLoad(
      route: Route,
      segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.userIsAuthenticated.pipe(take(1), tap(isAuthed => {
      if (!isAuthed) {
        this.route.navigateByUrl('/auth');
      }
    }));
  }
}
