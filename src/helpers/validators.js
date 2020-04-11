import {allPass, propEq, compose, values, identity, countBy, reduce, gte, curry, length, keys, filter} from 'ramda';

/**
 * @file Домашка по FP ч. 1
 * 
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = ({star, square, triangle, circle}) => {
    const obj = {star: star, triangle: triangle, square: square, circle: circle};
    const redStar = propEq('star', 'red');
    const greenSquare = propEq('square', 'green');
    const whiteTriangle = propEq('triangle', 'white');
    const whiteCircle = propEq('circle', 'white');
    const validateFirstRule = allPass([
        redStar,
        greenSquare,
        whiteTriangle,
        whiteCircle
    ])
    return validateFirstRule(obj);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = ({star, square, triangle, circle}) => {
    const colorsList = [star, triangle, square, circle];

    const isGreen = (color) => color === 'green';
    const INITIAL_GREENS_COUNT = 0;
    const greensCountReducer = (acc, color) => isGreen(color) ? ++acc : acc;
    const reduceWrapFunc = (reducer, initialCount, colors) => reduce(reducer, initialCount, colors);
    const curriedReduceWrapFunc = curry(reduceWrapFunc);
    const calcGreensCount = curriedReduceWrapFunc(greensCountReducer, INITIAL_GREENS_COUNT);

    const GREENS_COUNT_MINIMUM = 2;
    const notLessThanTwo = (count) => gte(count, GREENS_COUNT_MINIMUM);

    const validateSecondtRule = compose(
        notLessThanTwo,
        calcGreensCount
    );

    return validateSecondtRule(colorsList);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = ({star, square, triangle, circle}) => {
    const colors = {star: star, triangle: triangle, square: square, circle: circle};

    const getColors = compose(
        countBy(identity),
        values
    );
    
    const isRedsEqualToBlues = ({red, blue}) => red === blue;

    const validateThirdRule = compose(
        isRedsEqualToBlues,
        getColors
    );

    return validateThirdRule(colors);
};

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = ({star, square, triangle, circle}) => {
    const obj = {star: star, triangle: triangle, square: square, circle: circle};
    const blueCircle = propEq('circle', 'blue');
    const redStar = propEq('star', 'red');
    const orangeSquare = propEq('square', 'orange');
    const validateFourthRule = allPass([
        blueCircle,
        redStar,
        orangeSquare
    ])
    return validateFourthRule(obj);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = ({star, square, triangle, circle}) => {
    const colors = {star: star, triangle: triangle, square: square, circle: circle};
    
    const removeLessThanThreeSameColors = filter((color) => color >= 3);
    const removeWhite = filter((color) => color === 'white' ? false : true); 
    const getColors = compose(
        removeLessThanThreeSameColors,
        countBy(identity),
        removeWhite,
        values
    );

    const isNotEmpty = ({...args}) => {
        return length(keys(args)) > 0;
    };
    const validateFifthRule = compose(
        isNotEmpty,
        getColors
    );

    return validateFifthRule(colors);
};

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = ({star, square, triangle, circle}) => {
    const colors = {star: star, triangle: triangle, square: square, circle: circle};
    
    const isGreenOrRed = (color) => color === 'green' || color === 'red';
    const keepGreenAndRed = filter((color) => isGreenOrRed(color)); 
    const getColors = compose(
        countBy(identity),
        keepGreenAndRed,
        values
    );

    const isTwoGreens = propEq('green', 2);
    const isOneRed = propEq('red', 1);

    const hasTwoGreensAndOneRed = allPass([
        isTwoGreens,
        isOneRed
    ]);

    const isCorrectColorsCount = compose(
        hasTwoGreensAndOneRed,
        getColors
    );

    const isGreenTriangle = propEq('triangle', 'green');
    const validateSixthRule = allPass([
        isGreenTriangle,
        isCorrectColorsCount
    ]);

    return validateSixthRule(colors);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = ({star, square, triangle, circle}) => {
    const colors = [star, square, triangle, circle];
    const isOrangeFour = propEq('orange', 4);
    const validateSeventhRule = compose(
        isOrangeFour,
        countBy(identity)
    );
    return validateSeventhRule(colors);
}

// 8. Не красная и не белая звезда.
export const validateFieldN8 = ({star, square, triangle, circle}) => {
    const validateEightRule = color => color !== 'red' && color !== 'white';
    return validateEightRule(star);
}

// 9. Все фигуры зеленые.
export const validateFieldN9 = ({star, square, triangle, circle}) => {
    const colors = [star, square, triangle, circle];
    const isFourGreen = propEq('green', 4);
    const validateNinethRule = compose(
        isFourGreen,
        countBy(identity)
    );
    return validateNinethRule(colors);
}

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = ({star, square, triangle, circle}) => {
    const obj = {star: star, triangle: triangle, square: square, circle: circle};
    const isNotWhite = ({triangle, square}) => triangle !== 'white' || square !== 'white';
    const isTriangleEqualToSquare = ({triangle, square}) => triangle === square ;
    const validateTenthRule = allPass([
        isNotWhite,
        isTriangleEqualToSquare
    ]);
    return validateTenthRule(obj);
}
