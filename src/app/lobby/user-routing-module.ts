import {NgModel} from '@angular/forms';
import {NgModule} from '@angular/core';
import {Route, RouterModule, Routes} from '@angular/router';
import {PostLogPage} from './post-log/post-log.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: PostLogPage,
        children: [
            {path: 'joinLobby', children: [
                    {
                        path: '',
                        loadChildren: './join-lobby/join-lobby.module#JoinLobbyPageModule'
                    }
                ]},
            {path: 'edit:lobbyId', children: [
                    {
                        path: '',
                        loadChildren: './edit-lobby/edit-lobby.module#EditLobbyPageModule'
                    }
                ]},
            {path: 'viewLobby', children: [
                    {
                        path: ':lobbyId',
                        loadChildren: './lobby.module#LobbyPageModule'
                    }
                ]},
            {path: 'createLobby', children: [
                    {
                        path: '',
                        loadChildren: './create-lobby/create-lobby.module#CreateLobbyPageModule'
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
