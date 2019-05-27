import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from '../components/login/login.component';
import { GamePageComponent } from './pages/gamePage/gamePage.component';
import { CardComponent } from 'src/components/card/card.component';
import { ModalComponent } from 'src/components/modal/modal.component';

const appRoute: Routes = [
   { path: 'login', component: LoginComponent },
   { path: 'game', component: GamePageComponent },
   { path: '**', redirectTo: '/login' },
];

@NgModule({
   declarations: [
      AppComponent,
      LoginComponent,
      GamePageComponent,
      CardComponent,
      ModalComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      RouterModule.forRoot(
         appRoute
      )
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
