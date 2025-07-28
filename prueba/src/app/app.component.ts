import { Component, OnInit } from '@angular/core';
import { MqttService } from '../services/mqtt.service';
import { Amplify } from "aws-amplify"
import { AuthSession, fetchAuthSession } from 'aws-amplify/auth';
import { PubSub } from '@aws-amplify/pubsub';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'prueba';
  isLoggin = false;
  mostrarTabla = true;
  filaSeleccionada: any = null;
  chartLabels: string[] = [];
  chartData: number[] = [];
  userSesion!: AuthSession;
  pubSub!: PubSub;
  mqttSubscription: any;  

  datos = [
    { deviceID: 'sensor_1', name: "Sensor 1", status: "available" },
    { deviceID: 'sensor_2', name: "Sensor 2", status: "unavailable" },
    { deviceID: 'sensor_3', name: "Sensor 3", status: "available" },
    { deviceID: 'sensor_4', name: "Sensor 4", status: "available" },
    { deviceID: 'sensor_5', name: "Sensor 5", status: "available" },
    { deviceID: 'sensor_6', name: "Sensor 6", status: "unavailable" },
    { deviceID: 'sensor_7', name: "Sensor 7", status: "unavailable" },
    { deviceID: 'sensor_8', name: "Sensor 8", status: "available" },
    { deviceID: 'sensor_9', name: "Sensor 9", status: "available" },
    { deviceID: 'sensor_10', name: "Sensor10", status: "unavailable" },
  ];

  constructor(private mqttService: MqttService, private http: HttpClient){
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: "us-east-1_LlVqltOXQ",
          userPoolClientId: "8lvk3d28ddv168ljo0b8o7v1t",
          identityPoolId: "us-east-1:fda6da82-5b4e-4c87-a552-3f56005d0f23",
          loginWith: {
            email: true,
          },
          signUpVerificationMethod: "code",
          userAttributes: {
            email: {
              required: true,
            },
          },
          allowGuestAccess: true,
          passwordFormat: {
            minLength: 8,
            requireLowercase: true,
            requireUppercase: true,
            requireNumbers: true,
            requireSpecialCharacters: true,
          },
        },
      }
    })

    this.pubSub = new PubSub({
        region: 'us-east-1',
        endpoint: 'wss://a15rfcsvpu7np2-ats.iot.us-east-1.amazonaws.com/mqtt',
        clientId: 'edgar-client-' + Math.floor(Math.random() * 10000)
    });
  }

  async ngOnInit(): Promise<void> {
    this.userSesion = await fetchAuthSession();
    console.log(this.userSesion)

    if(this.userSesion.userSub) {
      this.isLoggin = true;
    }
  }

  async onSeleccionFila(item: any) {
    this.filaSeleccionada = item;
    if(this.filaSeleccionada.status == "available"){
          this.mostrarTabla = false;
    let data: any[] = [];
    let labels: any[] = []

    await this.getDataSensor()

    // this.chartData = [...data];
    // this.chartLabels = [...labels]

    this.mqttSubscription = this.pubSub.subscribe({topics: ["prueba"]}).subscribe((response: any) => {
      console.log("Data", response)
      if(response.S == this.filaSeleccionada.deviceID){
          const fechaFormateada = new Date().toLocaleString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        data.push(response.V)
        labels.push(fechaFormateada);

        this.chartData.push(response.V);
        this.chartLabels.push(fechaFormateada)

        this.chartData = [...this.chartData];
        this.chartLabels = [...this.chartLabels];
      }
    })
    }
  }

  regresar() {
    this.mostrarTabla = true;
    this.filaSeleccionada = null;

    this.mqttSubscription?.unsubscribe();
  }

  getDataSensor(){
     this.http.get(`http://localhost:8080/getLast15Min?sensor=${this.filaSeleccionada.deviceID}`)
      .subscribe(
        (data: any) => {
          console.log('Respuesta del backend:', data);
          console.log(data.datos.map((d: any) => d.V))
          this.chartData = [...data.datos.map((d: any) => d.V)]
          this.chartLabels = [...data.datos.map((d: any) => {
            const fechaFormateada = new Date(d.date).toLocaleString('es-MX', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            });
            
            return fechaFormateada
          })]
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }

  reports(){
    this.http.get(`http://localhost:8080/getReport/?sensor=${this.filaSeleccionada.deviceID}`)
      .subscribe(
        (data) => {
          console.log('Respuesta del backend:', data);
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }
}
