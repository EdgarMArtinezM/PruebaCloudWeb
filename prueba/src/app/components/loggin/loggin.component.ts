import { Component, OnInit } from '@angular/core';
import { signIn } from 'aws-amplify/auth'

@Component({
  selector: 'app-loggin',
  standalone: false,
  templateUrl: './loggin.component.html',
  styleUrls: ['./loggin.component.css']
})
export class LogginComponent implements OnInit {
  isSigned = false;
  email: string = '';
  password: string = '';

  constructor() {
    console.log("Entramos al inicio de sesion");
  }

  async ngOnInit(): Promise<void> { }

  async onSubmit() {
    console.log("Entramos");
    try {
      let sesion = await signIn({ username: this.email, password: this.password });
      console.log(sesion)
      if (sesion.nextStep.signInStep == "DONE") this.isSigned = true;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }
}
