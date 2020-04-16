import {Component, Input, NgZone, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {NavigationExtras, Router} from '@angular/router';
import {BLE} from '@ionic-native/ble/ngx';

@Component({
  selector: 'app-ble-device-scan',
  templateUrl: './ble-device-scan.component.html',
  styleUrls: ['./ble-device-scan.component.scss'],
})
export class BleDeviceScanComponent implements OnInit {
  @Input() devices: any[];
  constructor(private  modalCtrl: ModalController,  private route: Router,  private ble: BLE,
              private toastCtrl: ToastController, private ngZone: NgZone) {
  }

  ngOnInit() {}

  deviceSelected(device: any) {
    console.log(JSON.stringify(device) + ' selected');
    const navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(device),
      }
    };
    this.modalCtrl.dismiss();
    this.route.navigate(['device-details'], navigationExtras);
  }



  onCancel() {
    this.modalCtrl.dismiss();
  }
}
