/********************************/
/*         DEPENDENCIES         */
/********************************/
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { compose, ChildProps } from 'react-apollo';

import { functionsUtil } from './../../../../core/utils/functionsUtil';

import { AtomFormFields, IValidationError as IValidationAtomError } from './../../../../core/validations/atom';

import { IRootState } from './../../../../reducer/reducer.config';

import { 
    getAtomLibsFromList 
}  from './../../../../models/lib/lib.model';

import { nextStepAtomAction, prevStepAtomAction, skipStepAtomAction } from './../../../../actions/form.action';
import { createAtomAction } from './../../../../actions/atom.action';
import { CreateAtomInput } from './../../../../models/atom/atom.mutation';

import BasicFields from './Steps/BasicFields/BasicFields';
import Confirmation from './Steps/Confirmation';
import Success from './Steps/Success';

// -----------------------------------


/********************************/
/*      INTERFACES & TYPES      */
/********************************/

/* Own Props */
type ComponentNewProps = {};

/* Own States */
type LocalStates = {
    fieldValues: AtomFormFields,
    validationErrors: IValidationAtomError
};

/* Mapped State to Props */
type StateProps = {
    step: number,
    fields: AtomFormFields
};

/* Mapped Dispatches to Props */
type DispatchProps = {
    actions: {
        form: {
            nextStepAtom: (fieldValues: AtomFormFields) => void;
            prevStepAtom: () => void;
            skipStepAtom: () => void;
        },
        atomState: {
            createAtom: (input: CreateAtomInput) => Promise<any>;
        }
    };
};

/***********************************************/
/*              CLASS DEFINITION               */
/***********************************************/
class ComponentNew
extends React.Component<ChildProps<ComponentNewProps & StateProps & DispatchProps, {}>, LocalStates> {
    
    /********************************/
    /*         CONSTRUCTOR          */
    /********************************/
    constructor(props: ChildProps<ComponentNewProps & StateProps & DispatchProps, {}>) {
        super(props);

        // LOG
        functionsUtil.consoleLog('DashboardPage -> ComponentsPage -> ComponentNew container actived');

        // Init local state
        this.state = {
            fieldValues: {
                authorId: null,
                name: null,
                description: null,
                html: null,
                css: null,
                libs: [],
                contextualBg: '#FFFFFF',
                private: false,
                projectId: null,
                atomCategoryId: 0
            },
            validationErrors: {}
        };

        // Bind methods
        this.nextStep = this.nextStep.bind(this);
        this.previousStep = this.previousStep.bind(this);
        this.skipStep = this.skipStep.bind(this);
        this.submitCreation = this.submitCreation.bind(this);
    }


    /********************************/
    /*        PUBLIC METHODS        */
    /********************************/


    /**
     * @desc Next Step
     * @method nextStep
     * @example this.nextStep()
     * @public
     * @returns {void}
     */
    nextStep(fieldValues: AtomFormFields | Object = {}) {

        let newFieldValues = Object.assign({}, this.state.fieldValues, fieldValues);

        // Update local state
        this.setState({ fieldValues: newFieldValues },
        () => {
            this.props.actions.form.nextStepAtom(this.state.fieldValues);
        });

    }


    /**
     * @desc Previous Step
     * @method previousStep
     * @example this.previousStep()
     * @public
     * @returns {void}
     */
    previousStep() {
        this.props.actions.form.prevStepAtom();
    }


    /**
     * @desc Skip Step
     * @method skipStep
     * @example this.skipStep()
     * @public
     * @returns {void}
     */
    skipStep() {
        this.props.actions.form.skipStepAtom();
    }


    /**
     * @desc Submit Creation
     * @method submitCreation
     * @example this.submitCreation()
     * @public
     * @returns {void}
     */
    submitCreation(authorId: number) {

        // Copy fields
        let fieldValues = Object.assign({}, this.props.fields);

        // Assign current User as a author of this Atom
        fieldValues.authorId = authorId;

        // Get atom's libs from libs state
        fieldValues.libs = getAtomLibsFromList(fieldValues.libs);

        this.props.actions.atomState.createAtom(fieldValues).then(
            (response) => {
                if (response.ok) {
                    this.nextStep();
                } else {
                    // Update local state
                    // TODO: Hacer algo con este validationErrors (este viene de la validacion del Server)
                    // Ademas esta fallando en algo que no tiene que ver con validaciones, asi que siempre
                    // que falla va a entrar por aqui. No seria validationErrors sino cualquier error
                    this.setState({ validationErrors: response.validationErrors },
                    () => {
                        this.previousStep();
                    });
                }
            }
        );
    }


    /********************************/
    /*       PRIVATE METHODS        */
    /********************************/


    /**
     * @desc Get Step
     * @method _getStep
     * @example this._getStep()
     * @private
     * @returns {JSX.Element} Next Step
     */
    private _getStep(): JSX.Element {

        switch (this.props.step) {
            case 1:
                return (
                    <BasicFields nextStep={this.nextStep} />
                );
            case 2:
                return (
                    <Confirmation submitCreation={this.submitCreation} />
                );
            case 3:
                return (
                    <Success />
                );
            default:
                return (
                    <BasicFields nextStep={this.nextStep} />
                );
        }

    }

    
    /********************************/
    /*        RENDER MARKUP         */
    /********************************/
    render() {
        
        /*         MARKUP          */
        /***************************/
        return (
            <div className="ComponentNew StepByStep p-4">
                {this._getStep()}
            </div>
        );

    }

}


/********************************/
/*      MAP STATE TO PROPS      */
/********************************/
function mapStateToProps(state: IRootState): StateProps {
    
    const { step, fields } = state.form.atomForm;

    return {
        fields,
        step
    };
}


/********************************/
/*     MAP DISPATCH TO PROPS    */
/********************************/
function mapDispatchToProps(dispatch: Dispatch<IRootState>): DispatchProps {
    return {
        actions: {
            form: {
                nextStepAtom: (fieldValues) => dispatch(nextStepAtomAction(fieldValues)),
                prevStepAtom: () => dispatch(prevStepAtomAction()),
                skipStepAtom: () => dispatch(skipStepAtomAction())
            },
            atomState: {
                createAtom: (input: CreateAtomInput) => dispatch(createAtomAction(input))
            }
        }
    };
}


/********************************/
/*         REDUX CONNECT        */
/********************************/
const componentNewConnect = connect(mapStateToProps, mapDispatchToProps);


/*         EXPORT          */
/***************************/
export default compose(
    componentNewConnect
)(ComponentNew);


/*
    reference: https://www.viget.com/articles/building-a-multi-step-registration-form-with-react
 */