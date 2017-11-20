/************************************/
/*           DEPENDENCIES           */
/************************************/
import * as types from '../core/constants/action.types';
import * as appConfig from '../core/constants/app.constants';


/************************************/
/*            INTERFACES            */
/************************************/

export interface IClearUiAction {
    type: types.CLEAR_UI;
    modals: null;
    tabs: {
        atomDetailsTab: {
            tab: string | null
        },
        sourceCodeTab: {
            tab: string | null
        }
    };
    copied: null;
}

export interface IShowModalAction {
    type: types.SHOW_MODAL;
    modals: {
        modalType: string,
        modalProps: any
    };
}

export interface ICloseModalAction {
    type: types.CLOSE_MODAL;
}

export interface IChangeAtomDetailsTabAction {
    type: types.CHANGE_ATOM_DETAILS_TAB;
    tabs: {
        atomDetailsTab: {
            tab: string
        }
    };
}

export interface IChangeSourceCodeTabAction {
    type: types.CHANGE_SOURCE_CODE_TAB;
    tabs: {
        sourceCodeTab: {
            tab: string
        }
    };
}

export interface ICopySourceCodeAction {
    type: types.COPY_SOURCE_CODE;
    copied: {
        copiedType: string
    };
}


export type Action =
    // UI interaction
    IClearUiAction
|   IShowModalAction
|   ICloseModalAction
|   IChangeAtomDetailsTabAction
|   IChangeSourceCodeTabAction
|   ICopySourceCodeAction;



/************************************/
/*             ACTIONS              */
/************************************/


/**
 * @desc Return an action type, CLEAR_UI to reset UI states
 * @function clearUiAction
 * @returns {Action}
 */
export const clearUiAction = (): Action => {
    return {
        type: types.CLEAR_UI,
        modals: null,
        tabs: {
            atomDetailsTab: {
                tab: null
            },
            sourceCodeTab: {
                tab: appConfig.ATOM_DETAILS_DEFAULT_OPTION_TAB
            }
        },
        copied: null
    };
};


/**
 * @desc Return an action type, SHOW_MODAL 
 * to indicate that user wants opening a Modal
 * @function showModalAction
 * @returns {Action}
 */
export const showModalAction = (modalType: string, modalProps: any): Action => {
    return {
        type: types.SHOW_MODAL,
        modals: {
            modalType,
            modalProps
        }
    };
};


/**
 * @desc Return an action type, CLOSE_MODAL
 * to indicate that user wants closing a Modal
 * @function closeModalAction
 * @returns {Action}
 */
export const closeModalAction = (): Action => {
    return {
        type: types.CLOSE_MODAL
    };
};


/**
 * @desc Return an action type, CHANGE_ATOM_DETAILS_TAB 
 * to indicate that user wants to change atom details tab menu option
 * @function changeAtomDetailsTabAction
 * @returns {Action}
 */
export const changeAtomDetailsTabAction = (tab: string): Action => {
    return {
        type: types.CHANGE_ATOM_DETAILS_TAB,
        tabs: {
            atomDetailsTab: {
                tab
            }
        }
    };
};


/**
 * @desc Return an action type, CHANGE_SOURCE_CODE_TAB 
 * to indicate that user wants to change source code tab menu option
 * @function changeSourceCodeTabAction
 * @returns {Action}
 */
export const changeSourceCodeTabAction = (tab: string): Action => {
    return {
        type: types.CHANGE_SOURCE_CODE_TAB,
        tabs: {
            sourceCodeTab: {
                tab
            }
        }
    };
};


/**
 * @desc Return an action type, COPY_SOURCE_CODE 
 * to indicate that user wants to copy a source code block
 * @function copySourceCodeAction
 * @returns {Action}
 */
export const copySourceCodeAction = (copiedType: string): Action => {
    return {
        type: types.COPY_SOURCE_CODE,
        copied: {
            copiedType
        }
    };
};