import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-password-check',
  templateUrl: './password-check.component.html',
  styleUrls: ['./password-check.component.scss'],
})
export class PasswordCheckComponent implements OnInit {
  @Input() password: string;
  userPassword: string;
  @Input() lobbyId: string;
  constructor(private  modalCtrl: ModalController, private route: Router) { }

  ngOnInit() {}

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
