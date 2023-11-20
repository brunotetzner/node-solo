export class LateCheckInValidationError extends Error {
  constructor() {
    super("The check-in can't be validated because it's late");
  }
}
