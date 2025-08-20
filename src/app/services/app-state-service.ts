import { Injectable } from '@angular/core';
import { GlobalAppState } from '../shared/interfaces/global-app-state';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppStateService {
    private readonly STORAGE_KEYS: { [K in keyof GlobalAppState]: string } = {
        pseudo: 'autostop-pseudo',
        avatar: 'autostop-avatar',
        city: 'autostop-city'
    };
    private readonly _state: BehaviorSubject<GlobalAppState>;

    readonly pseudo$: Observable<string | null>;
    readonly avatar$: Observable<Base64URLString | null>;
    readonly city$: Observable<string | null>;


    constructor() {
        const initialState: GlobalAppState = {
            pseudo: localStorage.getItem(this.STORAGE_KEYS.pseudo),
            avatar: localStorage.getItem(this.STORAGE_KEYS.avatar),
            city: null
        };
        this._state = new BehaviorSubject<GlobalAppState>(initialState);
        this.pseudo$ = this._state.asObservable().pipe(
            map(state => state.pseudo),
            distinctUntilChanged()
        );
        this.avatar$ = this._state.asObservable().pipe(
            map(state => state.avatar),
            distinctUntilChanged()
        );
        this.city$ = this._state.asObservable().pipe(
            map(state => state.city),
            distinctUntilChanged()
        );
    }

    private updateState(newState: Partial<GlobalAppState>) {
        (Object.keys(newState) as Array<keyof GlobalAppState>).forEach(key => {
            const value = newState[key];
            const storageKey = this.STORAGE_KEYS[key];

            if (storageKey != this.STORAGE_KEYS.city) {
                if (value) {
                    localStorage.setItem(storageKey, value as string);
                } else {
                    localStorage.removeItem(storageKey);
                }
            }
        });

        const currentState = this._state.getValue();
        this._state.next({ ...currentState, ...newState });
    }

    set pseudo(pseudo: string | null) { this.updateState({ pseudo }); }
    get pseudo(): string | null { return this._state.getValue().pseudo; }

    set avatar(avatar: Base64URLString | null) { this.updateState({ avatar }); }
    get avatar(): Base64URLString | null { return this._state.getValue().avatar; }

    set city(city: string | null) { this.updateState({ city }); }
    get city(): string | null { return this._state.getValue().city; }
}