import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { GlobalAppState } from '../shared/interfaces/global-app-state.interface';
import { GeocodingResult, Position } from '../shared/interfaces/geocoding.interface';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable } from 'rxjs';
import { IndicatorState } from '../services/app-state.enum';
import { Ppec } from '../models/ppec-interface';


type Base64URLString = string;

@Injectable({
    providedIn: 'root'
})
export class AppStateService {
    private readonly STORAGE_KEYS = {
        pseudo: 'autostop-pseudo',
        avatar: 'autostop-avatar',
    } as const;

    private readonly _state: BehaviorSubject<GlobalAppState>;
    private _ppecs: WritableSignal<Ppec[]> = signal([]);

    readonly pseudo$: Observable<string | null>;
    readonly avatar$: Observable<Base64URLString | null>;
    readonly city$: Observable<GeocodingResult | null>;
    readonly position$: Observable<Position | null>;
    readonly indicator$: Observable<IndicatorState>;
    readonly requestSent$: Observable<boolean>;
    readonly dpecId$: Observable<number | null>;


    constructor() {
        const initialState: GlobalAppState = {
            pseudo: localStorage.getItem(this.STORAGE_KEYS.pseudo),
            avatar: localStorage.getItem(this.STORAGE_KEYS.avatar),
            city: null,
            position: null,
            requestSent: false,
            dpecId: null
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
        this.position$ = this._state.asObservable().pipe(
            map(state => state.position),
            distinctUntilChanged()
        );
        this.requestSent$ = this._state.asObservable().pipe(
            map(state => state.requestSent)
        );
        this.dpecId$ = this._state.asObservable().pipe(
            map(state => state.dpecId)
        );

        this.indicator$ = combineLatest(
            [this.pseudo$, this.avatar$, this.city$, this.position$, this.requestSent$]
        ).pipe(
            map(([pseudo, avatar, city, position, requestSent]) => {
                if (pseudo && avatar && city && position && !requestSent) {
                    return IndicatorState.READY_FOR_REQUEST;
                } else if ((!pseudo || !avatar || !city || !position) && !requestSent) {
                    return IndicatorState.WAITING_FOR_USER_DATA;
                } else {
                    return IndicatorState.REQUEST_SENT;
                }
            })
        );
    }

    private updateState(newState: Partial<GlobalAppState>) {
        type MyKeys = typeof this.STORAGE_KEYS;
        (Object.keys(newState) as Array<keyof GlobalAppState>).forEach(key => {
            if (key in this.STORAGE_KEYS) {

                const value = newState[key];
                const storageKey = this.STORAGE_KEYS[key as keyof MyKeys];

                if (storageKey) {

                    if (value) {
                        localStorage.setItem(storageKey, value as string);
                    } else {
                        localStorage.removeItem(storageKey);
                    }
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

    set city(city: GeocodingResult | null) { this.updateState({ city }); }
    get city(): GeocodingResult | null { return this._state.getValue().city; }

    set position(position: Position | null) { this.updateState({ position }); }
    get position(): Position | null { return this._state.getValue().position; }

    set requestSent(value: boolean) { this.updateState({ requestSent: value }); }
    get requestSent(): boolean { return this._state.getValue().requestSent; }

    set dpecId(id: number | null) { this.updateState({ dpecId: id }); }
    get dpecId(): number | null { return this._state.getValue().dpecId; }

    set ppecs(ppecs: Ppec[]) { this._ppecs.set(ppecs); }
    get ppecs(): Signal<Ppec[]> { return this._ppecs.asReadonly() }
}