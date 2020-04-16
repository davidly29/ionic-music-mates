import {Component, NgZone, OnInit} from '@angular/core';
import {ToastController} from '@ionic/angular';
import {BLE} from '@ionic-native/ble/ngx';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.page.html',
  styleUrls: ['./device-details.page.scss'],
})
export class DeviceDetailsPage implements OnInit {

  peripheral: any = {};
  statusMessage: string;
  loading: string;
  full: any;
  constructor(public route: ActivatedRoute, public router: Router,
              private ble: BLE,
              private toastCtrl: ToastController, private ngZone: NgZone) {

    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        const device = JSON.parse(params.special);
        this.setStatus('Connecting to ' + device.name || device.id);

        // Call BLE Connect - Connect to BLE Device
        this.ble.connect(device.id).subscribe(
            peripheral => this.onConnected(peripheral),
            peripheral => this.onDeviceDisconnected(peripheral)
        );
      }
    });

  }


  ngOnInit() {
  this.full = false;
  }
  fill() {
    if (this.full === false) {
      this.loadingSpin();
    }
  }

  loadingSpin() {
    setInterval(() => {
      // tslint:disable-next-line:no-unused-expression
      const arr = ['10', '30', '50', '65', '80', '100'];
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < arr.length; i++) {
        this.loading = arr[i];
        return this.loading;
      }
    }, 1000);
  }
  BleConnect(device) {
    this.ble.connect(device.id).subscribe(
        peripheral => this.onConnected(peripheral),
        peripheral => this.onDeviceDisconnected(peripheral)
    );
  }

  BleDisconnect() {
    this.ble.disconnect(this.peripheral.id).then(
        () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
        () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral)));
  }


  onConnected(peripheral) {
    this.ngZone.run(() => {
      this.setStatus('');
      this.peripheral = peripheral;
    });

    this.peripheral = peripheral;
    this.setStatus('Connected to ' + (peripheral.name || peripheral.id));

    // starting to get notification for each notified data on given characterstic id
    this.ble.startNotification(this.peripheral.id, 'SERVICE_ID', 'CHARACTERSITC_ID').subscribe(
        data => this.onDataChange(data)
    );

    // Read the current value of the characteristic
    this.ble.read(this.peripheral.id, 'SERVICE_ID', 'CHARACTERSITC_ID').then(
        data => this.onReadData(data)
    );
  }

  onDataChange(buffer: ArrayBuffer) {
    const data = new Uint8Array(buffer);
    // You will get the notification data here
    console.log(data);
  }

  onReadData(buffer: ArrayBuffer) {
    const data = new Uint8Array(buffer);
    // You will get the read data here
    console.log(data);

  }

  async onDeviceDisconnected(peripheral) {
    const toast = await this.toastCtrl.create({
      message: 'The peripheral unexpectedly disconnected',
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }

  // Disconnect peripheral when leaving the page
  // ionViewWillLeave() {
  //   console.log('ionViewWillLeave disconnecting Bluetooth');
  //   this.BleDisconnect();
  // }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

}

