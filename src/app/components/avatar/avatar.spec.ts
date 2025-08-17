import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { AppStateService } from '../../services/app-state-service';

import { Avatar } from './avatar';

describe('Avatar', () => {
  let component: Avatar;
  let fixture: ComponentFixture<Avatar>;
  let appStateService: AppStateService;
  let avatarSubject: BehaviorSubject<string | null>;
  let avatarSetterSpy: jasmine.Spy;

  beforeEach(async () => {
    avatarSubject = new BehaviorSubject<string | null>(null);

    const appStateServiceMock = {
      avatar$: avatarSubject.asObservable(),
      set avatar(value: string | null) { /* no-op */ },
      get avatar(): string | null { return null; }
    };

    await TestBed.configureTestingModule({
      imports: [Avatar],
      providers: [
        { provide: AppStateService, useValue: appStateServiceMock }
      ]
    });

    fixture = TestBed.createComponent(Avatar);
    component = fixture.componentInstance;
    appStateService = TestBed.inject(AppStateService);
    avatarSetterSpy = spyOnProperty(appStateService, 'avatar', 'set');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Display', () => {
    it('should display a default icon when no avatar is set', () => {
      avatarSubject.next(null);
      fixture.detectChanges();

      const defaultIcon = fixture.debugElement.query(By.css('mat-icon'));
      const avatarImage = fixture.debugElement.query(By.css('.avatar-image'));

      expect(defaultIcon).toBeTruthy();
      expect(avatarImage).toBeFalsy();
    });

    it('should display the user avatar when an avatar is set', () => {
      const avatarUrl = 'data:image/png;base64,test-avatar';
      avatarSubject.next(avatarUrl);
      fixture.detectChanges();

      const defaultIcon = fixture.debugElement.query(By.css('mat-icon'));
      const avatarImage: HTMLImageElement = fixture.nativeElement.querySelector('.avatar-image');

      expect(defaultIcon).toBeFalsy();
      expect(avatarImage).toBeTruthy();
      expect(avatarImage.src).toBe(avatarUrl);
    });
  });

  describe('User Interaction', () => {
    it('should trigger file input click when avatar container is clicked', () => {
      const fileInput = component.fileInputRef.nativeElement;
      spyOn(fileInput, 'click');

      const avatarContainerEl = fixture.debugElement.query(By.css('.avatar-container')).nativeElement;
      avatarContainerEl.click();

      expect(fileInput.click).toHaveBeenCalled();
    });
  });

  describe('File Selection', () => {
    it('should do nothing if no file is selected', () => {
      const mockEvent = { target: { files: [] } } as unknown as Event;
      component.onFileSelected(mockEvent);
      expect(avatarSetterSpy).not.toHaveBeenCalled();
    });

    it('should read the selected file and update the state service', () => {
      const mockFile = new File([''], 'avatar.png', { type: 'image/png' });
      const mockEvent = { target: { files: [mockFile] } } as unknown as Event;
      const mockReaderResult = 'data:image/png;base64,mock-base64-string';

      // Mock FileReader
      const mockFileReader = jasmine.createSpyObj('FileReader', ['readAsDataURL']);
      mockFileReader.readAsDataURL.and.callFake(() => {
        // Simuler l'assignation du résultat et le déclenchement de l'événement de fin
        mockFileReader.result = mockReaderResult;
        mockFileReader.onloadend();
      });
      spyOn(window, 'FileReader').and.returnValue(mockFileReader);

      component.onFileSelected(mockEvent);

      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
      expect(avatarSetterSpy).toHaveBeenCalledWith(mockReaderResult);
    });
  });
});
