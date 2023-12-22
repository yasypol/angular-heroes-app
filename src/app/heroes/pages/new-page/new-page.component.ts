import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { filter, switchMap, tap } from 'rxjs';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  // Formulario reactivo
  public heroForm = new FormGroup({
    id:               new FormControl<string>(''),
    superhero:        new FormControl<string>('', { nonNullable: true }),
    publisher:        new FormControl<Publisher>( Publisher.DCComics ),
    alter_ego:        new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters:       new FormControl<string>(''),
    alt_img:          new FormControl<string>('')
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics'},
    { id: 'Marvel Comics', desc: 'Marvel - Comics'},
  ]

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if ( !this.router.url.includes('edit') ) return;

    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.heroesService.getHeroById( id ))
      )
      .subscribe (hero => {
        if ( !hero ) {
          return this.router.navigateByUrl('/');
        }

        this.heroForm.reset(hero);
        return;
      })
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;

    return hero;
  }

  public onSubmit(): void {

    if ( this.heroForm.invalid ) return;

    // Actualización de héroe
    if (this.currentHero.id) {
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
          this.showSnackbar(  `${ hero.superhero } updated!` )
        });

      return;
    }

    // Crear héroe
    this.heroesService.addHero( this.currentHero )
      .subscribe( hero => {
        this.router.navigate(['/heroes/edit', hero.id]);
        this.showSnackbar(  `${ hero.superhero } created!` )
      });
  }

  onDeleteHero() :void {
    if ( !this.currentHero.id ) throw Error ('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
      .pipe(
        filter( (result: boolean) => result), // Si retorna true, continúa a la eliminación
        switchMap( () => this.heroesService.deleteHeroById(this.currentHero.id) ),
        filter( (wasDeleted: boolean) => wasDeleted) // Si esto es true, continua al subscribe
      )
      .subscribe(result => {
        this.router.navigate(['/heroes']);
    });
  }

  showSnackbar( message: string ): void {
    this.snackbar.open( message, 'Done' , {
      duration: 2500
    });
  }
}
