/************************************/
/*           DEPENDENCIES           */
/************************************/
import * as types from '../../constants/action.types';
import * as model from './uiComponent.model';
import { Action } from './uiComponent.action';



/************************************/
/*            INTERFACES            */
/************************************/

export interface IUiComponentState {
    items: Array<model.UiComponent>;
    error: string;
    fetching: Boolean;
    fetched: Boolean;
}

/************************************/
/*          DEFAULT STATE           */
/************************************/

const defaultState: IUiComponentState = {
    items: [],
    error: '',
    fetching: false,
    fetched: false
};



/** 
 * @desc This function takes UI Component actions and return a new state 
 * @param {IUiComponentState} [state=defaultState] 
 * @param {Action} action 
 * @returns {IUiComponentState} 
 */
export default function (state: IUiComponentState = defaultState, action: Action): IUiComponentState {

    switch (action.type) {

        /***********************************/
        /*       API REQUEST ACTIONS       */
        /***********************************/

        case types.GET_UICOMPONENT: {
            return {...state, fetching: true};
        }

        case types.GET_UICOMPONENT_FULFILLED: {
            return {...state, 
                    items: action.payload,
                    fetching: false,
                    fetched: true
            };
        }
        
        case types.GET_UICOMPONENT_ERROR: {
            return {...state, 
                    fetching: false,
                    error: action.payload
            };
        }


        /***********************************/
        /*            UI ACTIONS           */
        /***********************************/
            
        default:
            return state;  
    }
}