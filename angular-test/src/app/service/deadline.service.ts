import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';

import { DeadlineResponse } from '../model/deadlineResponse';

@Injectable({
  providedIn: 'root'
})
export class DeadlineService {
  private readonly apiUrl = '/api/deadline';

  constructor(
    private http: HttpClient
  ) {}

  getSecondsLeft(): Observable<number> {
    return this.http.get<DeadlineResponse>(this.apiUrl).pipe(
      map(response => response.secondsLeft),
      catchError(error => {
        console.error('Error fetching deadline:', error);
        return throwError(() => new Error('Failed to fetch deadline'));
      })
    );
  }
}
