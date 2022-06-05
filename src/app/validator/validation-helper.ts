import { ValidationErrors } from "@angular/forms";

const required = 'Field required';
const maxLength = 'Max lenght: {requiredLength}';
const minLength = 'Min lenght: {requiredLength}';
const min = 'Min: {min}';
const max = 'Max: {max}';
const abondendWord = 'Abondend word: {abondendWord}. Allowed word: {allowedWord}';

export enum ErrorForValidator {
    Required = "required",
    Email = "email",
    Max = "max",
    Maxlength = "maxlength",
    Min = "min",
    Minlength = "minlength",
    CustomValidator = "customValidator"
}

const additionalValueNames: string[] = [
    'requiredLength',
    'max',
    'min',
    'requiredPattern',
    'abondendWord',
    'allowedWord',
]

const errorMessages: TranslateMethod[] = [
    { name: ErrorForValidator.Required, method: (_) => required },
    { name: ErrorForValidator.Maxlength, method: (values: Map<string, string>) => parseString(values, maxLength), },
    { name: ErrorForValidator.Minlength, method: (values: Map<string, string>) => parseString(values, minLength), },
    { name: ErrorForValidator.Max, method: (values: Map<string, string>) => parseString(values, max), },
    { name: ErrorForValidator.Min, method: (values: Map<string, string>) => parseString(values, min), },
    { name: ErrorForValidator.CustomValidator, method: (values: Map<string, string>) => parseString(values, abondendWord), },
];

interface TranslateMethod {
    name: ErrorForValidator;
    method: (valuesToParse: Map<string, string>) => string
}

export function getParsedValidationMessage(error: ValidationErrors): string {
    for (const item of errorMessages) {
        const validator = error[item.name];
        if (validator) {
            const values = additionalValues(validator);
            return item.method(values);
        }
    }
    console.error(`Validation not implemented for validator: ${JSON.stringify(error)} `)
    return '';
}

function additionalValues(error: any): Map<string, string> {
    const values = new Map<string, string>();

    for (let item of additionalValueNames) {
        if (error[item])
            values.set(item, error[item]);
    }
    return values;
}

function parseString(values: Map<string, string>, text: string): string {
    for (let item of values) {
        text = text.replace(`{${item[0]}}`, item[1]);
    }
    return text;
}
