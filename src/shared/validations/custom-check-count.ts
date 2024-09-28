import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class CustomCheckCount implements ValidatorConstraintInterface {
  validate(count: number, args: ValidationArguments) {
    return count>0 // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `Count Should be More than 0`;
  }
}