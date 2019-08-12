import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserData } from '../classes/user-data';
@Injectable({
  providedIn: 'root'
})
/**
 * @class UserService controls all of the user data
 */
export class UserService {
  userData: UserData;

  constructor(private storage: Storage) {
    // Get the users data from storage, if there is none create the data
    this.getUserDataFromStorage().then((response: UserData) => {
      if (response === null) {
        this.userData = new UserData(0, 0, 0, 0);
        this.saveUserData(this.userData);
      } else {
        this.userData = response;
      }
    });
  }
  /**
   * This function handles all of the score calculations
   * @param score the value of the completed task
   */
  public addScore(score: number) {
    // If the lastCompleteDate is empty assign it to today
    if (
      this.userData.lastCompleteDate === null ||
      this.userData.lastCompleteDate === undefined
    ) {
      this.userData.lastCompleteDate = new Date();
    }
    // If there is no multiplier create one
    if (
      this.userData.multiplier === 0.0 ||
      this.userData.multiplier === null ||
      this.userData.multiplier === undefined
    ) {
      this.userData.multiplier = 0.05;
    } else {
      this.userData.multiplier = this.userData.multiplier + 0.001; // Increment the multiple by a % with each completed task
    }

    // Update the lastCompleteDate
    this.userData.lastCompleteDate = new Date();
    // if there is a valid multiplier calculate the new score
    if (
      this.userData.multiplier !== 0.0 ||
      this.userData.multiplier !== null ||
      this.userData.multiplier !== undefined
    ) {
      // New score is the score plus the score multiplied by the multiplier
      const multiplier = Number(score) * Number(this.userData.multiplier);
      score = Number(score) + Number(multiplier);
      score = Math.floor(score);
    }
    // Add to  the users overall score
    this.userData.totalScore = this.userData.totalScore + score;
    // Add to the user experience for this level
    this.userData.currentLevelExperience =
      this.userData.currentLevelExperience + score;
    // Check if the user levels up
    this.levelUpCheck();
    const dataToPass = this.userData;
    // Save the users data
    this.saveUserData(dataToPass);
  }

  /**
   * Userdata object getter
   * @returns userData the user data object
   */
  public getUserData(): UserData {
    return this.userData;
  }
  /**
   * Returns a promise that resolves with the users saved data
   */
  public getUserDataFromStorage() {
    return new Promise(response => {
      this.storage
        .get('userdata')
        .then(items => {
          response(items);
        })
        .catch(err => {
          console.log('Cannot load user data: ' + err);
        });
    });
  }
  /**
   * Performs all checks and calculations to level up the player
   */
  private levelUpCheck() {
    // If the users experience is higher than the experience to the next level, level them up
    if (
      this.userData.currentLevelExperience >=
      this.userData.experienceToNextLevel
    ) {
      // Increase the level
      this.userData.userLevel++;
      // If this is their first level up set leveling up experience to 550 or use the last levels XP + 10%
      if (
        this.userData.previousLevelExperience === 0 ||
        this.userData.previousLevelExperience === null ||
        this.userData.previousLevelExperience === undefined
      ) {
        this.userData.experienceToNextLevel = Math.floor(500 + 500 * 0.1);
      } else {
        this.userData.experienceToNextLevel = Math.floor(
          this.userData.previousLevelExperience +
            this.userData.previousLevelExperience * 0.1
        );
      }
      // Change the previous level experience to experience value of the level just completed
      this.userData.previousLevelExperience = this.userData.experienceToNextLevel;
      // Reset the current levels XP to 0
      this.userData.currentLevelExperience = 0;
    }
  }
  /**
   * clears the saved userdata by passing null to the storage function
   */
  public clearUserData() {
    this.storage.clear();
  }
  /**
   * Resets the variables, to be used after storage clear to empty the service
   */
  public resetVars() {
    this.userData = new UserData(0, 0, 0, 0);
  }
  /**
   * Save the users data to storage
   * @param userData the user data object to save
   */
  public saveUserData(userData: UserData) {
    this.storage.set('userdata', userData);
  }
}
