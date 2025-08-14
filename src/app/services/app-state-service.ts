import { Injectable } from '@angular/core';
import { GlobalAppState } from '../shared/interfaces/global-app-state';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppStateService {
    private readonly PSEUDO_STORAGE_KEY = 'autostop-pseudo';
    private readonly _state: BehaviorSubject<GlobalAppState>;

    readonly pseudo$: Observable<string | null>;

    constructor() {
        const initialState: GlobalAppState = {
            pseudo: localStorage.getItem(this.PSEUDO_STORAGE_KEY),
        };
        this._state = new BehaviorSubject<GlobalAppState>(initialState);
        this.pseudo$ = this._state.asObservable().pipe(
            map(state => state.pseudo)
        );
    }

    set pseudo(pseudo: string | null) {
        if (pseudo) {
            localStorage.setItem(this.PSEUDO_STORAGE_KEY, pseudo);
        } else {
            localStorage.removeItem(this.PSEUDO_STORAGE_KEY);
        }
        const currentState = this._state.getValue();
        const nextState = { ...currentState, pseudo: pseudo };
        this._state.next(nextState);
    }
}