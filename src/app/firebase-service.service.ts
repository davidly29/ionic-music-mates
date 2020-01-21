import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import {LobbyModel} from './lobby/lobby.model';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {
  private lobbyCollection: AngularFirestoreCollection<LobbyModel>;
  private lobby: Observable<LobbyModel[]>;
  constructor(db: AngularFirestore) {
   this.lobbyCollection = db.collection<LobbyModel>('todo');

   this.lobby = this.lobbyCollection.snapshotChanges().pipe(
       map(actions => {
         return actions.map(a => {
           const data = a.payload.doc.data();
           const id = a.payload.doc.id;
           return { id, ...data};
         });
       })
   );
  }
  getLobbies() {
    return this.lobby;
  }
  getLobby(id: string): Observable<LobbyModel> {
    return this.lobbyCollection.doc<LobbyModel>(id).valueChanges().pipe(
        take(1),
        map(lb => {
            lb.id = id;
            return lb;
        })
    );
  }
  updateLobby(lobby: LobbyModel, lobbyId: string) {
    return this.lobbyCollection.doc(lobbyId).update(lobby);
  }
  addLobby(lobby: LobbyModel) {
    return this.lobbyCollection.add(lobby);
  }
  removeLobby(lobbyId) {
    return this.lobbyCollection.doc(lobbyId).delete();
  }

}
