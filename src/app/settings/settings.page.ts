import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { UserData } from './../classes/user-data';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
class Settings {
  public taskDelete: boolean;
  public isCleared: boolean;
  constructor(taskDelete: boolean, isCleared: boolean = false) {
    this.taskDelete = taskDelete;
    this.isCleared = isCleared;
  }
}
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  settings: Settings;
  taskDelete = true;
  constructor(
    private userService: UserService,
    private storage: Storage,
    public alertController: AlertController
  ) {
    this.settings = new Settings(true);
    this.storage
      .get('settings')
      .then(response => {
        this.settings = response;
        this.taskDelete = this.settings.taskDelete;
      })
      .catch(() => {
        this.settings = new Settings(true);
        this.storage.set('settings', this.settings);
      });
  }

  ngOnInit() {}

  async clearUserData() {
    const alert = await this.alertController.create({
      header: 'Reset All Progress',
      subHeader: 'This will reset all levels, notes and multipliers',
      message: 'Are your sure?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'is-yellow is-pixelated',
          handler: () => {}
        },
        {
          text: 'I am sure!',
          cssClass: 'is-red is-pixelated',
          handler: () => {
            this.storage.remove('userdata');
            this.storage.remove('todoItems');
            const userData = new UserData(0, 0, 0, 0);
            this.userService.saveUserData(userData);
            this.settings.isCleared = true;
            this.saveSetting();
          }
        }
      ]
    });

    await alert.present();
  }
  saveSetting() {
    this.storage.set('settings', this.settings);
  }
  flipSetting(settingName: string, settingState: boolean) {
    this.settings[settingName] = settingState;
    this.saveSetting();
  }
}
