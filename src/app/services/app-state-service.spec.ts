import { TestBed } from '@angular/core/testing';

import { AppStateService } from './app-state-service';
import { firstValueFrom, skip } from 'rxjs';

describe('AppStateService', () => {
    let originalLocalStorage: Storage;
    const localStorageMock = {
        getItem: jasmine.createSpy('getItem'), // L'espion est créé une seule fois
        setItem: jasmine.createSpy('setItem'),
        removeItem: jasmine.createSpy('removeItem')
    };

    beforeEach(() => {
        originalLocalStorage = window.localStorage;
        Object.defineProperty(window, 'localStorage', { value: localStorageMock, configurable: true });

        // Réinitialiser les espions avant chaque test pour un état propre
        localStorageMock.getItem.calls.reset();
        localStorageMock.setItem.calls.reset();
        localStorageMock.removeItem.calls.reset();
    });

    afterEach(() => {
        Object.defineProperty(window, 'localStorage', { value: originalLocalStorage });
    });

    describe('when localStorage is empty', () => {
        let service: AppStateService;

        beforeEach(() => {
            localStorageMock.getItem.and.returnValue(null);
            TestBed.configureTestingModule({});
            service = TestBed.inject(AppStateService);
        });

        it('should initialize with null values', () => {
            expect(service.pseudo).toBeNull();
            expect(service.avatar).toBeNull();
            expect(localStorageMock.getItem).toHaveBeenCalledWith('autostop-pseudo');
            expect(localStorageMock.getItem).toHaveBeenCalledWith('autostop-avatar');
        });
    });

    describe('when localStorage has initial values', () => {
        let service: AppStateService;

        beforeEach(() => {
            localStorageMock.getItem.and.callFake((key: string) => {
                if (key === 'autostop-pseudo') return "fake pseudo";
                if (key === 'autostop-avatar') return "data:image/png;base64,test-avatar";
                if (key === 'autostop-city') return null;
                return null;
            });

            TestBed.configureTestingModule({});
            service = TestBed.inject(AppStateService);
        });

        it('should be created', () => {
            expect(service).toBeTruthy();
        });

        it('should initialize with values from local storage', () => {
            expect(service.pseudo).toBe("fake pseudo");
            expect(service.avatar).toBe("data:image/png;base64,test-avatar");
            expect(service.city).toBe(null);
            expect(localStorageMock.getItem).toHaveBeenCalledWith('autostop-pseudo');
            expect(localStorageMock.getItem).toHaveBeenCalledWith('autostop-avatar');
            expect(localStorageMock.getItem).not.toHaveBeenCalledWith('autostop-city');
        });

        it('should remove values from localstorage', () => {
            service.pseudo = null;
            service.avatar = null;
            service.city = null;
            expect(service.pseudo).toBe(null);
            expect(service.avatar).toBe(null);
            expect(service.city).toBe(null);
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('autostop-pseudo');
            expect(localStorageMock.removeItem).toHaveBeenCalledWith('autostop-avatar');
            expect(localStorageMock.removeItem).not.toHaveBeenCalledWith('autostop-city');
        });

        it('should set values in localstorage', () => {
            const newPseudo = 'New Pseudo';
            const newAvatar = 'data:image/png;base64,new-avatar';
            const newCity = { name: 'New City', address: { postcode: '12345' }, display_name: 'New City, 12345' };

            service.pseudo = newPseudo;
            service.avatar = newAvatar;
            service.city = newCity;

            expect(service.pseudo).toBe(newPseudo);
            expect(service.avatar).toBe(newAvatar);
            expect(service.city).toBe(newCity);
            expect(localStorageMock.setItem).toHaveBeenCalledWith('autostop-pseudo', newPseudo);
            expect(localStorageMock.setItem).toHaveBeenCalledWith('autostop-avatar', newAvatar);
            expect(localStorageMock.setItem).not.toHaveBeenCalledWith('autostop-city', newCity);
        });

        it('should emit new pseudo on pseudo$ when state is updated', async () => {
            const newPseudo = 'New pseudo';
            const pseudoPromise = firstValueFrom(service.pseudo$.pipe(skip(1)));
            service.pseudo = newPseudo;
            await expectAsync(pseudoPromise).toBeResolvedTo(newPseudo);
        });

        it('should emit new avatar on avatar$ when state is updated', async () => {
            const newAvatar = 'data:image/png;base64,new-avatar';
            const avatarPromise = firstValueFrom(service.avatar$.pipe(skip(1)));
            service.avatar = newAvatar;
            await expectAsync(avatarPromise).toBeResolvedTo(newAvatar);
        });

        it('should not emit on pseudo$ if the value is the same', (done) => {
            const samePseudo = 'fake pseudo'; // La même valeur que celle initialisée
            let emissions = 0;
            service.pseudo$.pipe(skip(1)).subscribe(() => {
                emissions++;
            });

            service.pseudo = samePseudo;

            // Utiliser setTimeout pour attendre une potentielle émission asynchrone
            setTimeout(() => {
                expect(emissions).toBe(0, 'should not emit when value is the same');
                done();
            }, 0);
        });

        it('should emit new city on city$ when state is updated', async () => {
            const newCity = { name: 'New City', address: { postcode: '12345' }, display_name: 'New City, 12345' };
            const cityPromise = firstValueFrom(service.city$.pipe(skip(1)));
            service.city = newCity;
            await expectAsync(cityPromise).toBeResolvedTo(newCity);
        });

        it('should not emit on city$ if the value is the same', (done) => {
            const sameCity = null; // La même valeur que celle initialisée
            let emissions = 0;
            service.city$.pipe(skip(1)).subscribe(() => {
                emissions++;
            });

            service.city = sameCity;

            setTimeout(() => {
                expect(emissions).toBe(0, 'should not emit when value is the same');
                done();
            }, 0);
        });
    })
});