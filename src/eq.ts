import { contramap, struct } from 'fp-ts/Eq';
import { getEq } from 'fp-ts/Array';

/* https://dev.to/gcanti/getting-started-with-fp-ts-setoid-39f3 */

interface Eq<A> {
    readonly equals: (x: A, y: A) => boolean;
}

const eqNumber: Eq<number> = {
    equals: (x, y) => x === y,
};

function elem<A>(E: Eq<A>): (a: A, as: Array<A>) => boolean {
    return (a, as) => as.some((item) => E.equals(item, a));
}

type Point = {
    x: number;
    y: number;
};

type Vector = {
    from: Point;
    to: Point;
};

const eqPoint: Eq<Point> = struct({
    x: eqNumber,
    y: eqNumber,
});

const eqVector: Eq<Vector> = struct({
    from: eqPoint,
    to: eqPoint,
});

const eqArrayOfPoints: Eq<Array<Point>> = getEq(eqPoint);

type User = {
    userId: number;
    name: string;
};

/** two users are equal if their `userId` field is equal */
const eqUser = contramap((user: User) => user.userId)(eqNumber);

export const printEQ = () => {
    console.log('##################### EQ #####################');

    const a = 2;
    const b = 2;
    const c = 2;

    console.log('Examples');
    console.log('1 & 2', eqNumber.equals(1, 2));
    console.log('1 & 1', eqNumber.equals(1, 1));

    console.log('Transitivity');
    console.log('a == b:', eqNumber.equals(a, b));
    console.log('b == c:', eqNumber.equals(b, c));
    console.log('--> a == c:', eqNumber.equals(a, c));

    console.log('Is in array');
    console.log('1, [1, 2, 3] --> true', elem(eqNumber)(1, [1, 2, 3]));
    console.log('4, [1, 2, 3] --> false', elem(eqNumber)(4, [1, 2, 3]));

    console.log('Complex type');
    console.log('{x:16, y:20} == {x:16, y:20} --> true', eqPoint.equals({ x: 16, y: 20 }, { x: 16, y: 20 }));
    console.log('{x:16, y:20} == {x=15, y=20} --> false', eqPoint.equals({ x: 16, y: 20 }, { x: 15, y: 20 }));

    console.log('More complex type');
    const vectorA = { from: { x: 16, y: 20 }, to: { x: 20, y: 25 } };
    const vectorB = { from: { x: 1, y: 2 }, to: { x: 2, y: 5 } };
    console.log('vectorA == vectorB', eqVector.equals(vectorA, vectorB));
    console.log('vectorA == vectorA', eqVector.equals(vectorA, vectorA));

    console.log('Array of points');
    console.log(
        'arrayA == arrayB',
        eqArrayOfPoints.equals(
            [
                { x: 16, y: 20 },
                { x: 20, y: 21 },
            ],
            [
                { x: 1, y: 2 },
                { x: 2, y: 3 },
            ]
        )
    );
    console.log(
        'arrayA == arrayA',
        eqArrayOfPoints.equals(
            [
                { x: 16, y: 20 },
                { x: 20, y: 21 },
            ],
            [
                { x: 16, y: 20 },
                { x: 20, y: 21 },
            ]
        )
    );

    console.log('Check for UserId');
    console.log('Same user id', eqUser.equals({ userId: 1, name: 'Giulio' }, { userId: 1, name: 'Giulio Canti' }));
    console.log('Different user id', eqUser.equals({ userId: 1, name: 'Giulio' }, { userId: 2, name: 'Giulio Canti' }));
};
