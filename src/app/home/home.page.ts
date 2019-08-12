import {Component, OnInit} from '@angular/core';
import {SuperTodoService} from '../services/super-todo.service';
import {UserService} from '../services/user.service';
import {AdMobFreeService} from '../services/ad-mob-free.service';
import {Platform} from '@ionic/angular';
import {SettingsPage} from '../settings/settings.page';
import {Storage} from '@ionic/storage';
import {ToastController} from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
    userData: any;
    todoItems: any[];
    itemText: string;
    itemScore: number;
    multiplier = 0.0;
    progressBarData: number;
    isLoaded = false;

    constructor(
        private admobFreeService: AdMobFreeService,
        private TodoService: SuperTodoService,
        public platform: Platform,
        public userService: UserService,
        private storage: Storage,
        public toastController: ToastController
    ) {
        this.todoItems = [];
        this.userData = {
            userLevel: 0,
            previousLevelExperience: 0,
            experienceToNextLevel: 500,
            currentLevelExperience: 0,
            totalScore: 0,
        };
        this.multiplier = 0.05;
        this.TodoService.getItemsFromStorage().then((response: any) => {
            this.todoItems = response;
        });

        this.userService.getUserDataFromStorage().then((response: any) => {
            this.userData = response;
            this.multiplier = response.multiplier ? response.multiplier : 0.05;
            this.progressBarValue(
                response.currentLevelExperience,
                response.experienceToNextLevel
            );
            this.isLoaded = true;
        });
    }

    ngOnInit() {
        if (this.platform.is('android')) {
            this.admobFreeService.BannerAd();
        }
    }

    ionViewWillEnter() {
        this.TodoService.getItemsFromStorage().then((response: any) => {
            this.todoItems = response;
        });

        this.userService.getUserDataFromStorage().then((response: any) => {
            this.userData = response;
            this.multiplier = response.multiplier;
            this.progressBarValue(
                response.currentLevelExperience,
                response.experienceToNextLevel
            );
            this.isLoaded = true;
        });
    }

    showRewardVideo() {
        this.admobFreeService.RewardVideoAd(this.userData.multiplier);
    }

    addItem(text: string, score: number) {
        if (
            text === null ||
            text === undefined ||
            text.trim() === '' ||
            score === null ||
            score === undefined ||
            score === 0
        ) {
            this.presentToast('Please set a task and priority');
        } else {
            this.TodoService.newTodoItem(text, score);
            this.getItems();
        }
    }

    completeTask(todoItem: any) {
        console.log('ckear');
        this.storage
            .get('settings')
            .then(response => {
                if (response.isCleared) {
                    this.userService.resetVars();
                    response.isCleared = false;
                    this.storage.set('settings', response);
                }
                this.TodoService.completeTask(todoItem);
                this.userService.addScore(todoItem.score);
                this.getItems();
                this.getUserData();
                this.multiplier = this.userData.multiplier;
                console.log(this.userData);
                console.log(this.todoItems);
                this.progressBarValue(
                    this.userData.currentLevelExperience,
                    this.userData.experienceToNextLevel
                );
                if (response.taskDelete) {
                    this.deleteTask(todoItem);
                }
            })
            .catch(() => {
                this.TodoService.completeTask(todoItem);
                this.userService.addScore(todoItem.score);
                this.getItems();
                this.getUserData();
                this.multiplier = this.userData.multiplier;
                console.log(this.userData);
                console.log(this.todoItems);
                this.progressBarValue(
                    this.userData.currentLevelExperience,
                    this.userData.experienceToNextLevel
                );
                this.deleteTask(todoItem);
            });
    }

    getUserData() {
        this.userData = this.userService.getUserData();
    }

    deleteTask(todoItem: any) {
        this.TodoService.deleteTask(todoItem);
        this.getItems();
    }

    getItems() {
        this.todoItems = this.TodoService.getTodoItems();
    }

    clearData() {
        this.userService.clearUserData();
    }

    progressBarValue(percentFor: number, percentOf: number) {
        if (percentFor === null || percentFor === undefined) {
            percentFor = 0;
        }
        this.progressBarData = Math.floor((percentFor / percentOf) * 100) / 100;
    }

    async presentToast(text: string) {
        const toast = await this.toastController.create({
            message: text,
            duration: 2000
        });
        toast.present();
    }
}
