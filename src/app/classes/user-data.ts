import { ThrowStmt } from '@angular/compiler';
export class UserData {
  userLevel: number;
  previousLevelExperience: number;
  experienceToNextLevel: number;
  currentLevelExperience: number;
  totalScore: number;
  lastCompleteDate: Date;
  multiplier: number;
  constructor(
    userLevel: number,
    previousLevelExperience: number,
    currentLevelExperience: number,
    totalScore: number
  ) {
    this.userLevel = userLevel;
    this.previousLevelExperience = previousLevelExperience;
    this.currentLevelExperience = currentLevelExperience;
    this.totalScore = totalScore;
    /**
     * Define the experience to the next level
     * this may be redundant but I'm too busy to double check
     */
    if (
      this.previousLevelExperience === 0 ||
      this.previousLevelExperience === null ||
      this.previousLevelExperience === undefined
    ) {
      this.experienceToNextLevel = 500;
    } else {
      this.experienceToNextLevel = Math.floor(
        this.previousLevelExperience + this.previousLevelExperience * 0.1
      );
    }
  }
}
