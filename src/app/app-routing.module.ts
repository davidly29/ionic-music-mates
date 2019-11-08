import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'post-log', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'song', loadChildren: './song/song.module#SongPageModule' },
  { path: 'playlist', loadChildren: './playlist/playlist.module#PlaylistPageModule' },
  { path: 'edit-playlist', loadChildren: './playlist/edit-playlist/edit-playlist.module#EditPlaylistPageModule' },
  { path: 'create-playlist', loadChildren: './playlist/create-playlist/create-playlist.module#CreatePlaylistPageModule' },
  { path: 'post-log', loadChildren: './lobby/post-log/post-log.module#PostLogPageModule' },
  { path: 'lobby', loadChildren: './lobby/lobby.module#LobbyPageModule' },
  { path: 'create-lobby', loadChildren: './lobby/create-lobby/create-lobby.module#CreateLobbyPageModule' },
  { path: 'join-lobby', loadChildren: './lobby/join-lobby/join-lobby.module#JoinLobbyPageModule' },
  { path: 'join-lobby/:id', loadChildren: './lobby/join-lobby/join-lobby.module#JoinLobbyPageModule' },
  { path: 'edit-lobby', loadChildren: './lobby/edit-lobby/edit-lobby.module#EditLobbyPageModule' },
  { path: 'service', loadChildren: './lobby/service/service.module#ServicePageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
