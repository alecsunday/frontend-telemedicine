import { Component } from '@angular/core';
import { UserSession } from "src/app/user/UserSession";
import { UserType } from './enumeration/UserType';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  dashboardRoute = 'patientp';

  constructor() {
    this.dashboardRoute = this.getDashboardPath()
  }

  isLoggedIn() {
    let user = UserSession.getUserSession()
    if(user != null || user != undefined) {
      return true
    }
    return false
  }
  
  logout() {
    UserSession.setUserSession(null)
  }

  getDashboardPath() {
    let user = UserSession.getUserSession()
    if(user === null){
      return 'home';
    }
    if(user.userType === UserType.PATIENT) {
      return 'patientp'
    } else if (user.userType === UserType.DOCTOR){
      return 'doctorp'
    } else if (user.userType === UserType.ADMIN){
      return 'adminp'
    }

    return null;
  }
}
