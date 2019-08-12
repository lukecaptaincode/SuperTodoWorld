export class TodoItem {
  public itemID: string;
  public text: string;
  public score: number;
  public isDone: boolean;
  public startDate: Date;
  public endDate: Date;
  public duration: any;

  constructor(
    id: string,
    text: string,
    score: number = 0,
    startDate: Date,
    isDone: boolean = false
  ) {
    this.itemID = id;
    this.text = text;
    this.score = score;
    this.isDone = isDone;
    this.startDate = startDate;
  }
}
