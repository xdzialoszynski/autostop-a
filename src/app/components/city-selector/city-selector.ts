import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AppStateService } from '../../services/app-state-service';
import { GeocodingResult } from '../../shared/interfaces/geocoding.interface';
import { GeocodingService } from '../../services/geocoding/geocoding-service';

@Component({
  selector: 'app-city-selector',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatIconModule, AsyncPipe],
  templateUrl: './city-selector.html',
  styleUrl: './city-selector.scss'
})
export class CitySelector implements OnInit, OnDestroy {
  @ViewChild(MatInput) searchInput!: MatInput;
  @ViewChild(MatAutocomplete) autocomplete!: MatAutocomplete;

  // Le FormControl peut contenir une chaîne (pendant la saisie) ou un objet (après sélection).
  isEditing = false;
  searchCtrl = new FormControl<string | GeocodingResult>('');
  results: GeocodingResult[] = [];
  isLoading = false;

  cityDisplayName$!: Observable<string>;

  private destroy$ = new Subject<void>();

  constructor(private geocodingService: GeocodingService, private state: AppStateService) { }

  ngOnInit(): void {
    this.cityDisplayName$ = this.state.city$.pipe(
      map(city => {
        // Si une ville est sélectionnée (et a les bonnes propriétés), on formate son nom.
        if (city && city.name && city.address?.postcode) {
          return `${city.name}, ${city.address.postcode}`;
        } else if (city && city.name) {
          return city.name
        }
        // Sinon, on affiche le texte par défaut.
        return 'Choisir une ville';
      })
    );

    this.searchCtrl.valueChanges.pipe(
      // 3. Attendre 300ms après la dernière frappe avant de lancer la recherche.
      debounceTime(300),
      // 4. Ne pas lancer la recherche si la valeur n'a pas changé.
      distinctUntilChanged(),
      // On ne fait une recherche que si la valeur est une chaîne de caractères (et non un objet sélectionné).
      filter(value => typeof value === 'string'),
      tap(() => this.isLoading = true),
      // 5. Annuler la requête précédente si une nouvelle arrive.
      switchMap(value => {
        // On s'assure que `value` est bien une chaîne ici.
        if (value && value.length > 2) {
          return this.geocodingService.getAutocompletion(value);
        }
        return []; // Retourner un observable vide si la recherche est trop courte.
      }),
      tap(() => this.isLoading = false),
      // 6. Se désinscrire automatiquement à la destruction du composant.
      takeUntil(this.destroy$)
    ).subscribe((results) => {
      this.results = results;
      console.log(results);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Cette fonction est appelée lorsque l'utilisateur sélectionne une option.
  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedCity = event.option.value;
    console.log('Ville sélectionnée:', selectedCity);
    this.state.city = selectedCity;

  }
  onInputBlur(): void {
    // Nous utilisons un setTimeout pour gérer le cas où l'utilisateur clique sur une option.
    // L'événement blur se déclenche avant l'événement de sélection de l'option.
    // Ce délai permet de s'assurer que si une option est sélectionnée, le panneau
    // est déjà considéré comme "fermé" lorsque ce code s'exécute.
    setTimeout(() => {
      // Si le panneau d'autocomplétion n'est plus ouvert, cela signifie que l'utilisateur
      // a cliqué ailleurs ou a appuyé sur Echap. On repasse en mode affichage.
      if (!this.autocomplete.isOpen) {
        this.switchToDisplayMode();
      }
    }, 200); // Un délai de 200ms est généralement suffisant.
  }

  switchToEditMode(): void {
    this.isEditing = true;
    // Vider le champ pour que l'utilisateur puisse commencer une nouvelle recherche
    this.searchCtrl.setValue('');
    // Attendre que la vue soit mise à jour pour que l'input soit visible, puis lui donner le focus.
    setTimeout(() => {
      this.searchInput?.focus();
    });
  }

  switchToDisplayMode(): void {
    this.isEditing = false;
    // Si une ville a été sélectionnée, on met à jour le champ avec l'objet ville.
    // Sinon, on le vide pour ne pas laisser un texte de recherche partiel.
    this.searchCtrl.setValue(this.state.city || '');
  }



  // Cette fonction est utilisée par l'autocomplete pour savoir quoi afficher dans l'input
  // une fois qu'un objet a été sélectionné.
  displayFn(city: GeocodingResult): string {
    // Utiliser display_name pour être cohérent avec ce qui est affiché dans les options
    return city && city.display_name ? city.display_name : '';
  }
}
