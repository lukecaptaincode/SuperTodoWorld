import { UserData } from './../classes/user-data';
import { UserService } from './user.service';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {
  AdMobFree,
  AdMobFreeBannerConfig,
  AdMobFreeInterstitialConfig,
  AdMobFreeRewardVideoConfig
} from '@ionic-native/admob-free/ngx';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AdMobFreeService {

  // Reward Video Ad's Configurations
  RewardVideoConfig: AdMobFreeRewardVideoConfig = {
    autoShow: false,
    id: 'ca-app-pub-5946653721028511/1794506866'
  };
  UserService: UserService;
  constructor(
    public admobFree: AdMobFree,
    public platform: Platform,
    private storage: Storage
  ) {
    this.UserService = new UserService(storage);
    platform.ready().then(() => {

      // Load ad configuration
      this.admobFree.rewardVideo.config(this.RewardVideoConfig);
      // Prepare Ad to Show
      this.admobFree.rewardVideo
        .prepare()
        .then(() => {
          // alert(2);
        })
        .catch(e => alert(e));
    });
    // Handle Reward's close event to Prepare Ad again
    this.admobFree.on('admob.rewardvideo.events.CLOSE').subscribe(() => {
      this.admobFree.rewardVideo
        .prepare()
        .then(() => {})
        .catch(e => alert(e));
    });
  }

  BannerAd() {
    const bannerConfig: AdMobFreeBannerConfig = {
      autoShow: true,
      id: 'ca-app-pub-5946653721028511/6622547311'
    };
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner
      .prepare()
      .then(() => {
        // success
      })
      .catch(e => alert('Unable to launch ad service'));
  }


  RewardVideoAd(multiplier: number) {
    // Check if Ad is loaded
    this.admobFree.rewardVideo
      .isReady()
      .then(() => {
        // Will show prepared Ad
        this.admobFree.rewardVideo
          .show()
          .then(() => {
            this.UserService.getUserDataFromStorage().then(
              (response: UserData) => {
                response.multiplier = response.multiplier + 0.05;
                this.UserService.saveUserData(response);
              }
            );
          })
          .catch(e => {
            alert('Unable to show ad, please again later.');
          });
      })
      .catch(e => {
        alert('Unable to launch ad service ');
      });
  }
}
