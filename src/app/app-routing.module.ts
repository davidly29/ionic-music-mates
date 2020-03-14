import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule, FirestoreSettingsToken} from '@angular/fire/firestore';
import { environment} from '../environment';
import {GuardGuard} from './auth/guard.guard';

const routes: Routes = [
  { path: '', redirectTo: 'post-log', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'post-log', loadChildren: './lobby/post-log/post-log.module#PostLogPageModule' },
  { path: 'lobby', loadChildren: './lobby/lobby.module#LobbyPageModule' },
  { path: 'create-lobby', loadChildren: './lobby/create-lobby/create-lobby.module#CreateLobbyPageModule', },
  { path: 'join-lobby', loadChildren: './lobby/join-lobby/join-lobby.module#JoinLobbyPageModule'},
  { path: 'join-lobby/:id', loadChildren: './lobby/view-lobby/view-lobby.module#ViewLobbyPageModule'},
  { path: 'edit-lobby', loadChildren: './lobby/edit-lobby/edit-lobby.module#EditLobbyPageModule' },
  { path: 'service', loadChildren: './lobby/service/service.module#ServicePageModule' },
  { path: 'view-lobby', loadChildren: './lobby/view-lobby/view-lobby.module#ViewLobbyPageModule', canLoad: [GuardGuard]},
  { path: 'play-song', loadChildren: './lobby/play-song/play-song.module#PlaySongPageModule', canLoad: [GuardGuard]},
  { path: 'lobby-joined', loadChildren: './lobby/lobby-joined/lobby-joined.module#LobbyJoinedPageModule' },
  { path: 'playlist', loadChildren: './playlist/playlist.module#PlaylistPageModule' },



];

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  providers: [
    {provide: FirestoreSettingsToken, useValue: {} } // timestamp date issue ( open on github )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
