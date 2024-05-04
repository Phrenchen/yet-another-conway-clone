import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalDataShareService {

  private device!: BluetoothDevice;
  private characteristic!: BluetoothRemoteGATTCharacteristic;

  async connectToDevice() {
    try {
      this.device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['<your service UUID>']
      });

      const server = await this.device.gatt?.connect();
      if (server) {
        console.log('gonna connect!', this.device, server);
        
        const service = await server.getPrimaryService('<your service UUID>');
        this.characteristic = await service.getCharacteristic('<your characteristic UUID>');
      }
    } catch (error) {
      console.error('Bluetooth connection error:', error);
    }
  }

  sendData(data: any) {
    if (this.characteristic && this.characteristic.writeValue) {
      const jsonStr = JSON.stringify(data);
      const dataArrayBuffer = new TextEncoder().encode(jsonStr);
      this.characteristic.writeValue(dataArrayBuffer);
    }
  }
}
