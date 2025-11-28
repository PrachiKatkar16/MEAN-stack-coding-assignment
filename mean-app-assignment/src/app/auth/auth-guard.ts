import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth-service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      take(1),
      map(isLoggedIn => {
        console.log('🔐 AuthGuard - isLoggedIn:', isLoggedIn);
        
        if (!isLoggedIn) {
          console.log('🚫 Access denied - redirecting to login');
          this.router.navigate(['/login']);
          return false;
        }
        
        console.log('✅ Access granted');
        return true;
      })
    );
  }
}