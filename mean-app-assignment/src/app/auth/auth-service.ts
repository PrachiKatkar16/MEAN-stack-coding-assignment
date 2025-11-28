import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());

  login(username: string, password: string): Observable<any> {
    // Remove the HTTP call completely - use mock authentication
    const isAuthenticated = username === 'admin' && password === 'password123';
    
    return of({
      success: isAuthenticated,
      message: isAuthenticated ? 'Login successful' : 'Invalid credentials',
      token: isAuthenticated ? 'mock-jwt-token-' + Date.now() : null
    }).pipe(
      delay(800), // Simulate network delay
      tap((response: any) => {
        if (response.success && response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.isAuthenticated.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isAuthenticated.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }
}