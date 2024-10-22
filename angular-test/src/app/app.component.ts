import { ChangeDetectionStrategy,
  ChangeDetectorRef, Component } from '@angular/core';
import { Subject, Observable, interval, startWith, switchMap,
  map, catchError, EMPTY, takeUntil } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { DeadlineService } from './service/deadline.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    HttpClientModule
  ],
  providers: [DeadlineService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  private destroy$ = new Subject<void>();
  secondsLeft$: Observable<number>;

  constructor(
    private deadlineService: DeadlineService,
    private cdr: ChangeDetectorRef
  ) {
    this.secondsLeft$ = interval(1000).pipe(
      startWith(0),
      switchMap(() => this.deadlineService.getSecondsLeft()),
      map(seconds => Math.max(0, seconds)),
      catchError(error => {
        console.error('Error in countdown stream:', error);
        return EMPTY;
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnInit(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
