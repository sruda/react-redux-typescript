/************************************/
/*           DEPENDENCIES           */
/************************************/
import { fork } from 'redux-saga/effects';
import watchGetUiComponent from './saga.watcher';



/************************************/
/*             ROOT SAGA            */
/************************************/
// Here, we register our watcher saga(s) and export as a single generator
// function (rootSaga) as our root Saga.
export default function* rootSaga() {
    yield fork(watchGetUiComponent);
}



/*

- fork: es un effect creator que le dice al middleware que ejecute una llamada no bloqueante
a la saga 'watchGetUiComponent'.

- Aqui, podemos agrupar nuestros watchers sagas como un array y 'yield' estas de inmediato.
e.g. 

yield[
    fork(watchGetUiComponent),
    fork(watchGetUser),
    .
    .
    .
];

*/