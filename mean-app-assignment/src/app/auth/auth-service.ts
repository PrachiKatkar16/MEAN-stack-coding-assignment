import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());

  login(username: string, password: string): Observable<any> {
    console.log('Login attempt for user:', username);
    
    const isValid = username === 'admin' && password === 'password123';
    
    if (!isValid) {
      // Instant response for invalid credentials
      console.log('Login failed: Invalid credentials');
      return of({
        success: false,
        message: 'Invalid username or password. Please check your credentials and try again.',
        token: null
      });
    }

    // Simulate API call only for valid credentials
    return of({
      success: true,
      message: 'Login successful',
      token: 'mock-jwt-token-' + Date.now()
    }).pipe(
      delay(800), // Simulate API call
      tap((response: any) => {
        this.setToken(response.token);
        console.log('Login successful, token set');
      })
    );
  }

  setToken(token: string): void {
    sessionStorage.setItem('authToken', token);
    this.isAuthenticated.next(true);
  }

  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    this.isAuthenticated.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  private hasToken(): boolean {
    return !!sessionStorage.getItem('authToken');
  }
}