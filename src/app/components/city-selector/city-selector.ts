import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GeocodingService } from '../../services/geocoding/geocoding-service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-city-selector',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatIconModule],
  templateUrl: './city-selector.html',
  styleUrl: './city-selector.scss'
})
export class CitySelector implements OnInit, OnDestroy {
  @ViewChild(MatInput) searchInput!: MatInput;

  // Le FormControl peut contenir une chaîne (pendant la saisie) ou un objet (après sélection).
  isEditing = false;
  searchCtrl = new FormControl<string | any>('');
  results: any[] = [];
  isLoading = false;

  citySelected: any;

  // Pour communiquer la ville sélectionnée au composant parent.
  // @Output() citySelected = new EventEmitter<any>();


  // Subject pour gérer la désinscription et éviter les fuites mémoire.
  private destroy$ = new Subject<void>();

  constructor(private geocodingService: GeocodingService) { }

  ngOnInit(): void {
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
    this.citySelected = selectedCity;
    // Vous pouvez maintenant utiliser `selectedCity` pour faire ce que vous voulez,
    // comme l'envoyer à un service ou l'émettre vers un composant parent.
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
    this.searchCtrl.setValue(this.citySelected || '');
  }



  // Cette fonction est utilisée par l'autocomplete pour savoir quoi afficher dans l'input
  // une fois qu'un objet a été sélectionné.
  displayFn(city: any): string {
    // Utiliser display_name pour être cohérent avec ce qui est affiché dans les options
    return city && city.display_name ? city.display_name : '';
  }
}
