import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import {LobbyModel} from './lobby/lobby.model';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {LobbyUserModel} from './lobby/join-lobby/lobbyUserModel';
import {MessageModel} from './lobby/view-lobby/messageModel';
import {AngularFirestoreDocument} from '@angular/fire/firestore';
import {PlaylistModel} from './playlist/PlaylistModel';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {
  private lobbyCollection: AngularFirestoreCollection<LobbyModel>;
  private userCollection: AngularFirestoreCollection<LobbyUserModel>;
  private lobbyMessageCollection: AngularFirestoreCollection<MessageModel>;
  private playlistCollection: AngularFirestoreCollection<PlaylistModel>;

  private lobby: Observable<LobbyModel[]>;
  private user: Observable<LobbyUserModel[]>;
  private lobbyMessage: Observable<MessageModel[]>;
  private playlist: Observable<PlaylistModel[]>;

  tempLobbyObj: AngularFirestoreDocument<any>;

  constructor(db: AngularFirestore) {
   this.lobbyCollection = db.collection<LobbyModel>('todo');
   this.userCollection = db.collection<LobbyUserModel>('userInLobby');
   this.lobbyMessageCollection = db.collection<MessageModel>('lobbyMessage');
   this.playlistCollection = db.collection<PlaylistModel>('playlist');

   this.lobby = this.lobbyCollection.snapshotChanges().pipe(
       map(actions => {
         return actions.map(a => {
           const data = a.payload.doc.data();
           const id = a.payload.doc.id;
           return { id, ...data};
         });
       })
   );

   this.lobbyMessage = this.lobbyMessageCollection.snapshotChanges().pipe(
       map(actions => {
           return actions.map((a => {
               const data = a.payload.doc.data();
               const id = a.payload.doc.id;
               return { id, ...data};
           }));
       })
   );

   this.user = this.userCollection.snapshotChanges().pipe(
          map(actions => {
              return actions.map((a => {
                  const data = a.payload.doc.data();
                  const id = a.payload.doc.id;
                  return { id, ...data};
              }));
          })
      );

   this.playlist = this.playlistCollection.snapshotChanges().pipe(
       map(actions => {
           return actions.map((a => {
               const data = a.payload.doc.data();
               const id = a.payload.doc.id;
               return { id, ...data};
           }));
       })
   );
  }

  getLobbies() {
    return this.lobby;
  }

  getAllMessages() {
      return this.lobbyMessage;
  }

  getPlaylists() {
      return this.playlist;
  }
  deletePlaylist(playlistId) {
      return this.playlistCollection.doc(playlistId).delete();
  }
  getLobbyMessages(id: string): Observable<MessageModel> {
      return this.lobbyMessageCollection.doc<MessageModel>(id).valueChanges().pipe(
          take(1),
          map(lb => {
              lb.lobbyId = id;
              return lb;
          })
      );
  }

  getLobby(id: string) {
    return this.lobbyCollection.doc<LobbyModel>(id).valueChanges();
  }
  updateLobby(lobby: LobbyModel, lobbyId: string) {
    return this.lobbyCollection.doc(lobbyId).update(lobby);
  }
  addLobby(lobby: LobbyModel) {
    return this.lobbyCollection.add(lobby);
  }

  updatePlaylist(playlist: PlaylistModel, playlistId: string) {
    return this.playlistCollection.doc(playlistId).update(playlist);
  }

  updateUser(user: LobbyUserModel, id: string) {
      return this.userCollection.doc(id).update(user);
  }

  addPlaylist(playlist: PlaylistModel) {
      return this.playlistCollection.add(playlist);
  }

  removeLobby(lobbyId) {
      return this.lobbyCollection.doc(lobbyId).delete();
  }

  //////////////////////////////////////////////////////

  getUsers() {
      return this.user;
  }

  getUser(id) {
      return this.lobbyCollection.doc<LobbyModel>(id).valueChanges().pipe(
          take(1),
          map(lb => {
              lb.id = id;
              return lb;
          })
      );
  }

  deleteUserFromLobby(lobby: LobbyModel) {
      return this.lobbyCollection.doc(lobby.id).update(lobby);
  }

  addUser(user: LobbyUserModel) {
      return this.userCollection.add(user);
  }

  addLobbyMessage(lobbyMsg: MessageModel) {
      return this.lobbyMessageCollection.add(lobbyMsg);
  }

}
