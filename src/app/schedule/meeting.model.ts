export class Meeting {
  constructor(
    public date: String, // yyyy-MM-dd
    public openingHymn: String,
    public closingHymn: String,
    public conductor: String,
    public openingPrayer: String,
    public closingPrayer: String,
    public speakers: any[],
    public id?: String
  ) {}
}