import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
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
              private firebaseService: FirebaseServiceService) { }

  ngOnInit() {
    this.checkIfJoined = '';
  }

  checkPassword() {
    if (this.userPassword === this.password) {
      this.onCancel();
      this.route.navigate(['/join-lobby' + '/' + this.lobbyId]);
    } else {
      this.onCancel();
      this.route.navigate(['/post-log/tabs/joinLobby']);
    }
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }
}
