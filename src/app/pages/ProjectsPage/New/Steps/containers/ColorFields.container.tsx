/********************************/
/*         DEPENDENCIES         */
/********************************/
import * as React from 'react';
import { connect } from 'react-redux';
import { compose, ChildProps } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import { functionsUtil } from './../../../../../../core/utils/functionsUtil';
import { 
    ColorFields as ColorFormFields,
    validateColorFields, 
    IValidationError 
} from './../../../../../../core/validations/project';

import { getColorListFormatted } from './../../../../../../selectors/ui.selector';
import { getIsAuthenticated } from './../../../../../../selectors/auth.selector';

import { IRootState } from './../../../../../../reducer/reducer.config';

import { ColorListItem } from './../../../../../../reducer/ui.reducer';

import ColorFields from './../components/ColorFields';


// -----------------------------------


/********************************/
/*      INTERFACES & TYPES      */
/********************************/

/* Own Props */
type ColorFieldsContainerProps = {
    nextStep: (fieldValues: ColorFormFields) => void,
    previousStep: () => void
};

/* Own States */
type LocalStates = {
    validationErrors?: IValidationError
};

/* Mapped State to Props */
type StateProps = {
    colorsList: Array<ColorListItem>;
    isAuthenticated: boolean
};


/***********************************************/
/*              CLASS DEFINITION               */
/***********************************************/
class ColorFieldsContainer
extends React.Component<ChildProps<ColorFieldsContainerProps & StateProps, {}>, LocalStates> {

    
    /********************************/
    /*         CONSTRUCTOR          */
    /********************************/
    constructor(props: ChildProps<ColorFieldsContainerProps & StateProps, {}>) {
        super(props);

        // LOG
        functionsUtil.consoleLog('ProjectNew -> Step: 2 - ColorFields actived');

        // Init local state
        this.state = {
            validationErrors: {}
        };

        // Bind methods
        this.handlePrevClick =  this.handlePrevClick.bind(this);
        this.handleNextClick =  this.handleNextClick.bind(this);
        
    }


    /********************************/
    /*        PUBLIC METHODS        */
    /********************************/


    /**
     * @desc HandlePrevClick
     * @method handlePrevClick
     * @example this.handlePrevClick()
     * @public
     * @param {React.FormEvent<{}>} e - Event
     * @returns {void}
     */
    handlePrevClick(e: React.FormEvent<{}>) {
        e.preventDefault();
        this._previousStep();
    }


    /**
     * @desc HandleNextClick
     * @method handleNextClick
     * @example this.handleNextClick()
     * @public
     * @param {React.FormEvent<{}>} e - Event
     * @returns {void}
     */
    handleNextClick(e: React.FormEvent<{}>) {
        e.preventDefault();
        this._nextStep();
    }


    /*********************************/
    /*        PRIVATE METHODS        */
    /*********************************/


    /**
     * @desc Previous Step
     * @method _previousStep
     * @example this._previousStep()
     * @private
     * @returns {void}
     */
    private _previousStep() {
        this.props.previousStep();
    }


    /**
     * @desc Validate each field
     * @method isValid
     * @example this.isValid()
     * @private
     * @returns {void}
     */
    private _isValid() {

        const { colorsList } = this.props;
        const {errors, isValid} = validateColorFields({colorPalette: colorsList});

        if (!isValid) {
            this.setState({
                validationErrors: errors
            });

            // Go top pages
            window.scrollTo(0, 0);
        }

        return isValid;
    }


    /**
     * @desc Next Step
     * @method _nextStep
     * @example this._nextStep()
     * @private
     * @returns {void}
     */
    private _nextStep() {
        const { colorsList } = this.props;

        if (this._isValid()) {
            this.props.nextStep({ colorPalette: colorsList });    
        }
    }

    
    /********************************/
    /*        RENDER MARKUP         */
    /********************************/
    render() {


        /*       PROPERTIES       */
        /**************************/
        const { isAuthenticated } = this.props;
        const { validationErrors } = this.state;
        
        
        /*       VALIDATIONS       */
        /***************************/
        if (!isAuthenticated) {
            return (
                <Redirect to="/"/>
            );
        }

        
        /*         MARKUP          */
        /***************************/
        return (
            <ColorFields validationErrors={validationErrors}
                        onPrevClick={this.handlePrevClick}
                        onNextClick={this.handleNextClick}/>
        );

    }

}


/********************************/
/*      MAP STATE TO PROPS      */
/********************************/
function mapStateToProps(state: IRootState): StateProps {
    
    return { 
        colorsList: getColorListFormatted(state),
        isAuthenticated: getIsAuthenticated(state)
    };
}


/********************************/
/*         REDUX CONNECT        */
/********************************/
const colorFieldsContainerConnect = connect(mapStateToProps);


/*         EXPORT          */
/***************************/
export default compose(
    colorFieldsContainerConnect
)(ColorFieldsContainer);