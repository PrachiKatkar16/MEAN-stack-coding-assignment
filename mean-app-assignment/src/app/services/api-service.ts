import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

export interface ApiObject {
  id: string;
  name?: string;
  data?: {
    color?: string;
    capacity?: string;
    price?: number;
    [key: string]: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.restful-api.dev/objects';

  constructor(private http: HttpClient) {}

  getAllObjects(): Observable<ApiObject[]> {
    console.log('Fetching data from API...');
    return this.http.get<ApiObject[]>(this.apiUrl).pipe(
      catchError(this.handleError('getAllObjects'))
    );
  }

  updateObject(id: string, object: ApiObject): Observable<ApiObject> {
    console.log('Attempting to update object via API...', id);
    
    // Try the API call, but if it fails (405), simulate local update
    return this.http.put<ApiObject>(`${this.apiUrl}/${id}`, object).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 405) {
          console.log('API is read-only, simulating local update');
          // Simulate successful update locally
          return of({...object, id}).pipe(delay(300));
        }
        // For other errors, throw them
        return this.handleError('updateObject')(error);
      })
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      console.error(` ${operation} failed:`, error);
      
      let errorMessage = 'An error occurred';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Server returned ${error.status}: ${error.message}`;
      }
      
      return throwError(() => new Error(errorMessage));
    };
  }
}