export class maxNumberOfCheckinsError extends Error {
  constructor() {
    super("Max distance of checkins reached");
  }
}
