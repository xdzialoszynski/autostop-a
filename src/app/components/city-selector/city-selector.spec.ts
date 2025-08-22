import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { MatOptionHarness } from '@angular/material/core/testing';

import { CitySelector } from './city-selector';
import { GeocodingResult } from '../../shared/interfaces/geocoding.interface';

describe('CitySelector', () => {
  let component: CitySelector;
  let fixture: ComponentFixture<CitySelector>;
  let httpTestingController: HttpTestingController;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitySelector],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideNoopAnimations()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CitySelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // S'assure qu'il n'y a pas de requêtes HTTP en attente.
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle to edit mode on click', fakeAsync(() => {
    const displayElement = fixture.debugElement.query(By.css('.city-display'));
    displayElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    tick(); // Process setTimeout in switchToEditMode to set focus
    expect(component.isEditing).toBeTrue();
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(nativeElement.querySelector('input')).toBeTruthy();
  }));

  it('should return to display mode when input loses focus (blur)', fakeAsync(() => {
    // 1. Passer en mode édition
    const displayElement = fixture.debugElement.query(By.css('.city-display'));
    displayElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    tick(); // Laisser le setTimeout de switchToEditMode s'exécuter

    expect(component.isEditing).toBeTrue();

    // 2. Récupérer l'élément input et simuler sa perte de focus (blur)
    const inputElement = fixture.debugElement.query(By.css('input'));
    inputElement.triggerEventHandler('blur', null);

    // 3. Avancer l'horloge pour exécuter le setTimeout dans onInputBlur
    tick(200);
    fixture.detectChanges();

    // 4. Vérifier que le composant est revenu en mode affichage
    expect(component.isEditing).toBeFalse();
    const newDisplayElement = fixture.debugElement.query(By.css('.city-display'));
    expect(newDisplayElement).toBeTruthy();
  }));

  it('should search and display options after typing text', (async () => {
    // 1. Passer en mode édition
    const displayElement = fixture.debugElement.query(By.css('.city-display'));
    displayElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    // 2. Utiliser le Harness pour interagir avec l'autocomplétion
    const autocompleteHarness = await loader.getHarness(MatAutocompleteHarness);
    await autocompleteHarness!.enterText('marseille');

    fixture.detectChanges();

    // 3. Simuler la réponse de l'API
    const mockResults: GeocodingResult[] = [
      { name: 'Marseille', display_name: 'Marseille, Bouches-du-Rhône, France', address: { postcode: '13000' } },
      { name: 'Marseillan', display_name: 'Marseillan, Hérault, France', address: { postcode: '34340' } }
    ];
    const req = httpTestingController.expectOne(request => request.url.includes('nominatim.openstreetmap.org/search'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('city')).toBe('marseille');
    req.flush(mockResults);

    // 4. Vérifier que les options sont bien affichées en utilisant le Harness
    const options = await autocompleteHarness!.getOptions();
    fixture.detectChanges();
    console.log(options[0].getText);
    expect(options.length).toBe(2, 'should display two options');

    let firstOptionText = '';
    firstOptionText = await options[0].getText()
    console.log(`valeur selectionnée : ${firstOptionText}`);
    expect(firstOptionText).toContain('Marseille, Bouches-du-Rhône, France');

  }));

});
