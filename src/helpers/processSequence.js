import {allPass, compose} from 'ramda';

/**
 * @file Домашка по FP ч. 2

Берем строку N. Пишем изначальную строку в writeLog.

Привести строку к числу, округлить к ближайшему целому с точностью до единицы, записать в writeLog.

C помощью API /numbers/base перевести из 10-й системы счисления в двоичную, результат записать в writeLog

Взять кол-во символов в полученном от API числе записать в writeLog
Возвести в квадрат с помощью Javascript записать в writeLog
Взять остаток от деления на 3, записать в writeLog
C помощью API /animals.tech/id/name получить случайное животное используя полученный остаток в качестве id
Завершить цепочку вызовом handleSuccess в который в качестве аргумента положить результат полученный на предыдущем шаге

 * 
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 * 
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 * 
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';

const api = new Api();
const VALIDATION_ERROR = 'ValidationError';

// конвертация строки в число
const strToNumber = str => Number(str);

const validateString = str => new Promise((resolve, reject) => {
    // символы в строке только [0-9] и точка, т.е. это валидное число в 10-ной системе счисления
    const re = /^\d+(\.\d+)?$/;
    const isValidNumericCharacters = str => re.test(str);
    // кол-во символов в числе должно быть больше 2.
    // кол-во символов в числе должно быть меньше 10.
    const MIN_CHARS_COUNT = 2;
    const MAX_CHARS_COUNT = 10;
    const validateMax = n => n < MAX_CHARS_COUNT; 
    const validateMin = n => n > MIN_CHARS_COUNT; 
    const isValidCharsCount = str => validateMax(str.length) && validateMin(str.length);
    // число должно быть положительным
    const isPositive = n => n > 0;
    const checkPositive = compose(isPositive, strToNumber);

    const validStr = allPass([
        isValidNumericCharacters,
        isValidCharsCount,
        checkPositive
    ]);
     
    if (validStr(str)) {
        resolve(str);
    } else {
        reject(VALIDATION_ERROR);
    }
});


/*В случае ошибки валидации вызвать handleError с 'ValidationError' строкой в качестве аргумента*/
const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    writeLog(value); // 1.
    
    validateString(value) // 2.
    .then(str => {  // 3.
        const roundedN = Math.round(strToNumber(str));
        writeLog(roundedN);
        return roundedN;
    }).then(async n => { // 4.
        const response = await api.get('https://api.tech/numbers/base', {from: 10, to: 2, number: n});
        const binary = response.result;
        writeLog(binary);
        return binary;
    }).then(binary => { // 5.
        const charactersCount = binary.length;
        writeLog(charactersCount);
        return charactersCount;
    }).then(n => { // 6.
        const square = n*n;
        writeLog(square);
        return square;
    }).then(n => { // 7.
        const modulo = n % 3;
        writeLog(modulo);
        return modulo;
    }).then(async id => { // 8.
        const response = await api.get(`https://animals.tech/${id}`, {});
        const animal = response.result;
        writeLog(animal);
        return animal;
    }).then(animal => {
        handleSuccess(animal);
    }).catch(error => {
        handleError(error);
    })
}

export default processSequence;
