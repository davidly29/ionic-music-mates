/*
Author: David Lynch
Description: This class function is used to check the password of a lobby upon entering
 */
import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {LobbyModel} from '../../lobby.model';
import {AuthService} from '../../../auth/auth.service';
import {FirebaseServiceService} from '../../../firebase-service.service';

@Component({
  selector: 'app-password-check',
  templateUrl: './password-check.component.html',
  styleUrls: ['./password-check.component.scss'],
})
export class PasswordCheckComponent implements OnInit {
  @Input() password: string;
  @Input() lobbyToJoin: LobbyModel;
  userPassword: string;
  @Input() lobbyId: string;
  checkIfJoined = '';
  constructor(private  modalCtrl: ModalController, private route: Router, private authService: AuthService,
              private firebaseService: FirebaseServiceService, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.checkIfJoined = '';
  }

  checkPassword() {
    if (this.userPassword === this.password) {
      this.onCancel();
      const name = this.lobbyToJoin.joinedUsers.find(x => x === this.authService.user.getValue().email);
      if (name == null) {
        this.lobbyToJoin.joinedUsers.push(this.authService.user.getValue().email);
        this.firebaseService.updateLobby(this.lobbyToJoin, this.lobbyToJoin.id);
      }
      this.route.navigate(['/join-lobby' + '/' + this.lobbyId]);
    } else {
      this.onCancel();
      this.toastCtrl.create({
        message: 'Incorrect Password',
        duration: 3000,
        showCloseButton: true,
        closeButtonText: 'OK',
        animated: true
      }).then((obj) => {
        obj.present();
      });
      this.route.navigate(['/post-log/tabs/joinLobby']);
    }
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }
}
