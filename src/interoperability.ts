import { Option, none, some, match } from 'fp-ts/Option';
import { Either, getOrElse, tryCatch } from 'fp-ts/Either';

function findIndex<A>(as: Array<A>, predicate: (a: A) => boolean): Option<number> {
    const index = as.findIndex(predicate);
    return index === -1 ? none : some(index);
}

function parse(s: string): Either<Error, unknown> {
    return tryCatch(
        () => JSON.parse(s),
        (reason) => new Error(String(reason))
    );
}

export const printInteroperability = () => {
    console.log('##################### Interoperability #####################');

    const valueFound = findIndex([{ id: 1 }, { id: 2 }], (o) => o.id === 1);
    const noValueFound = findIndex([{ id: 1 }, { id: 2 }], (o) => o.id === 42);

    const matchFunction = match(
        () => console.log('Keinen Wert gefunden!'),
        (val) => console.log(`Index gefunden: ${val}`)
    );

    matchFunction(valueFound);
    matchFunction(noValueFound);

    const parsableEither = parse('{"key":"abc"}');
    const nonParsableEither = parse('{key:abc}');
    const getWithDefault = getOrElse((): unknown => ({}));

    console.log('Successful parsing', getWithDefault(parsableEither));
    console.log('Parsing with error', getWithDefault(nonParsableEither));
};
