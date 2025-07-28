import { Injectable } from '@angular/core';
import mqtt from "mqtt"
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MqttService {
  private client!: mqtt.MqttClient;
  private topic = 'prueba';

  public datos$ = new Subject<number>(); // Datos para la gráfica

  connect() {
    console.log("entramos")
    const clientId = 'angular-client-' + Math.random().toString(16).substr(2, 8);

    this.client = mqtt.connect('wss://a15rfcsvpu7np2-ats.iot.us-east-1.amazonaws.com/mqtt', {
      clientId: clientId,
      protocol: 'wss',
      connectTimeout: 5000,
      clean: true,
    });

    console.log(this.client)

    this.client.on('connect', () => {
      console.log('Conectado a AWS IoT');
      this.client.subscribe(this.topic, {}, (err) => {
        if (!err) console.log('Suscrito al topic:', this.topic);
        console.log(err)
      });
    });

    this.client.on('message', (topic, payload) => {
      const message = JSON.parse(payload.toString());
      console.log('Mensaje MQTT:', message);

      this.datos$.next(message.valor);
    });

    this.client.on('error', (err) => console.error('Error MQTT:', err));
  }
}
