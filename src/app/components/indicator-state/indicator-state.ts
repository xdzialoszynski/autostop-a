import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { AppStateService } from '../../services/app-state-service';
import { IndicatorState as enumIndicatorState } from '../../services/app-state.enum';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-indicator-state',
  imports: [CommonModule],
  templateUrl: './indicator-state.html',
  styleUrl: './indicator-state.scss'
})
export class IndicatorState implements OnInit, OnDestroy {
  indicatorColor$!: Observable<string>;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private state: AppStateService) { }

  ngOnInit(): void {
    this.indicatorColor$ = this.state.indicator$.pipe(
      map(indicator => {
        switch (indicator) {
          case enumIndicatorState.READY_FOR_REQUEST:
            return 'green';
          case enumIndicatorState.WAITING_FOR_USER_DATA:
            return 'red';
          case enumIndicatorState.REQUEST_SENT:
            return 'blue';
        }
      })
    );
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
