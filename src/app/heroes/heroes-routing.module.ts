import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroesLayoutPageComponent } from './pages/layout-page/layout-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { HeroPageComponent } from './pages/hero-page/hero-page.component';

const routes: Routes = [
  {
    // localhost:4200/heroes
    path: '',
    component: HeroesLayoutPageComponent,
    children: [
      // El orden de declaración de los paths es importante
      { path: 'new-hero', component: NewPageComponent }, // localhost:4200/heroes/new-hero
      { path: 'search', component: SearchPageComponent },
      { path: 'edit/:id', component: NewPageComponent },
      { path: 'list', component: ListPageComponent },
      // Los parámetros mejor declararlos al final
      { path: ':id', component: HeroPageComponent },
      { path: '**', redirectTo: 'list' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HeroesRoutingModule { }
