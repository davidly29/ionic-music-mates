import {NgModel} from '@angular/forms';
import {NgModule} from '@angular/core';
import {Route, RouterModule, Routes} from '@angular/router';
import {PostLogPage} from './post-log/post-log.page';
import {GuardGuard} from '../auth/guard.guard';

const routes: Routes = [
    {
        path: 'tabs',
        component: PostLogPage,
        children: [
            {path: 'joinLobby', children: [
                    {
                        path: '',
                        loadChildren: './join-lobby/join-lobby.module#JoinLobbyPageModule', canLoad: [GuardGuard]
                    }
                ]},
            {path: 'viewLobby', children: [
                    {
                        path: ':lobbyId',
                        loadChildren: './lobby.module#LobbyPageModule', canLoad: [GuardGuard]
                    }
                ]},
            {path: 'createLobby', children: [
                    {
                        path: '',
                        loadChildren: './create-lobby/create-lobby.module#CreateLobbyPageModule', canLoad: [GuardGuard]
                    }
                ]},
            {path: 'song', children: [
                    {
                        path: '',
                        loadChildren: './play-song/play-song.module#PlaySongPageModule', canLoad: [GuardGuard]
                    }
                ]},
            {
                path: '',
                redirectTo: '/post-log/tabs',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/post-log/tabs',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {}
