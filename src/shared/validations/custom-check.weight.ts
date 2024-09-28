import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class CustomCheckWeight implements ValidatorConstraintInterface {
  validate(weight: number, args: ValidationArguments) {
    return weight>0 // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `Weight Should be More than 0`;
  }
}