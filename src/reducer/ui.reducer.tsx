/************************************/
/*           DEPENDENCIES           */
/************************************/
import * as appConfig from '../core/constants/app.constants';
import * as types from '../core/constants/action.types';
import { Action } from '../actions/ui.action';


/************************************/
/*            INTERFACES            */
/************************************/

export interface IUiState {
    modals: Array<{modalType: string, modalProps: any}>;
    tabs: {
        atomDetailsTab?: {
            tab: string
        },
        sourceCodeTab?: {
            tab: string
        }
    };
    copied: {
        copiedType: string
    };
    duplicated: {
        atomId: number,
        isDuplicated: boolean;
    };
    message?: string;
}

/************************************/
/*          DEFAULT STATE           */
/************************************/

const defaultState: IUiState = {
    modals: [],
    tabs: {
        atomDetailsTab: {
            tab: null
        },
        sourceCodeTab: {
            tab: appConfig.ATOM_DETAILS_DEFAULT_OPTION_TAB
        }
    },
    copied: null,
    duplicated: {
        atomId: null,
        isDuplicated: false
    }
};

// -----------------------------------


/** 
 * @desc This function takes UI actions and return a new state 
 * @param {IUiState} [state=defaultState] 
 * @param {Action} action 
 * @returns {IUiState} 
 */
export default function (state: IUiState = defaultState, action: Action): IUiState {

    switch (action.type) {

        /***********************************/
        /*            UI ACTIONS           */
        /***********************************/

        case types.CLEAR_UI: {
            return {
                ...state, 
                modals: [],
                tabs: {
                    atomDetailsTab: {
                        tab: null
                    },
                    sourceCodeTab: {
                        tab: appConfig.ATOM_DETAILS_DEFAULT_OPTION_TAB
                    }
                },
                copied: null,
                duplicated: {
                    atomId: null,
                    isDuplicated: false
                }
            };
        }

        case types.SHOW_MODAL: {
            return {
                ...state,
                // Always pushing a new modal onto the stack
                modals: state.modals.concat({
                    modalType: action.modals.modalType,
                    modalProps: action.modals.modalProps
                })
            };
        }

        case types.CLOSE_MODAL: {

            // Always popping the last modal off the stack
            const newModalsState = state.modals.slice();
            newModalsState.pop();
            return {
                ...state,
                modals: newModalsState
            };
        }

        case types.CHANGE_ATOM_DETAILS_TAB: {
            return {
                ...state,
                tabs: {
                    ...state.tabs,
                    atomDetailsTab: {
                        tab: action.tabs.atomDetailsTab.tab
                    }
                }
            };
        }

        case types.CHANGE_SOURCE_CODE_TAB: {
            return {
                ...state,
                tabs: {
                    ...state.tabs,
                    sourceCodeTab: {
                        tab: action.tabs.sourceCodeTab.tab
                    }
                }
            };
        }

        case types.COPY_SOURCE_CODE: {
            return {
                ...state,
                copied: {
                    copiedType: action.copied.copiedType
                }
            };
        }

        // TODO: Mover todo lo alusivo a Atom a su respectivo 'reducer' file
        case types.DUPLICATE_ATOM_REQUEST: {
            return {
                ...state,
                duplicated: {
                    atomId: action.duplicated.atomId,
                    isDuplicated: false
                }
            };
        }

        case types.DUPLICATE_ATOM_SUCCESS: {
            return {
                ...state,
                duplicated: {
                    atomId: action.duplicated.atomId,
                    isDuplicated: true
                }
            };
        }

        case types.DUPLICATE_ATOM_FAILURE: {
            return {
                ...state,
                duplicated: {
                    atomId: action.duplicated.atomId,
                    isDuplicated: false
                },
                message: action.message
            };
        }
            
        default:
            return state;  
    }
}
