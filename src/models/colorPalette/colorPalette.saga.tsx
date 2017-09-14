/************************************/
/*           DEPENDENCIES           */
/************************************/
import { put, call } from 'redux-saga/effects';
import {getColorPalettes} from '../../api/api';
import * as types from '../../constants/action.types';
import { getColorPaletteSuccessAction } from './colorPalette.action';
import * as model from './colorPalette.model';


/** 
 * @desc Responsible for get Color Palettes list from server, making calls 
 * to the API and instructing the redux-saga middleware on the next line of 
 * action, for success or failure operation.
 * @function getColorPalettesSaga
 * @return {void}
 */
export default function* getColorPalettesSaga () {
    try {

        const colorPalettes: Array<model.ColorPalette> = yield call(getColorPalettes);

        yield[
            put(getColorPaletteSuccessAction(colorPalettes))
        ];

    } catch (error) {
        yield put({ type: types.GET_COLORPALETTE_ERROR, error });
    }
}


/*
Teoria:

- call: Es un 'effect' de redux-saga que le dice al middleware que ejecute una funcion que 
es pasada como primer parametro, y que esa funcion lleve como parametro el 'payload' (el cual
es opcional).

Flujo:

1. getUiComponentsSaga es llamado por el saga watcher (watchGetUiComponent definido en ./sagas/watcher.tsx),
cada vez que la action 'GET_UICOMPONENT' es despachado hacia el Store.

2. Esta Saga, sirve como intermediario entre la API y los reducers.

3. Por lo tanto, cuando se llama a la saga (getUiComponentsSaga), esta realiza la llamada
'call' a la API (getUiComponents) con el 'payload'. Entonces el resultado de la promesa
(resuelto o rechazado) y un action object son lanzados (yield) al reducer usando el effect creator: 'put'.

4. 'put' le dice al middleware que action despachar.

5. Note, que estamos 'yieldeando' un array de effects. Esto es por que queremos que se ejecuten
simultaneamente. El comportamiento por defecto seria pausar después de cada declaración 'yield'
el cual no es el comportamiento que queremos.

6. Finalmente, si alguna de las operaciones falla, le decimos al middleware 'put' que despache una
action de Falla (GET_UICOMPONENT_ERROR).




*/