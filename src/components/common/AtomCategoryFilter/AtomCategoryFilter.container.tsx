/********************************/
/*         DEPENDENCIES         */
/********************************/
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { graphql, compose, ChildProps } from 'react-apollo';

import { GET_ALL_ATOM_CATEGORIES_QUERY, GetAllResponse } from '../../../models/atomCategory/atomCategory.query';
import { AtomCategory as AtomCategoryModel } from '../../../models/atomCategory/atomCategory.model';

import { IRootState } from '../../../reducer/reducer.config';
import { ISearchState } from '../../../reducer/search.reducer';

import { searchAtomsAction } from '../../../actions/search.action';

import Icon from '../Icon/Icon';


// -----------------------------------


/********************************/
/*      INTERFACES & TYPES      */
/********************************/

/* Own Props */
type AtomCategoryFilterProps = {};

/* Own States */
type LocalStates = {
    value: string
};

/* Mapped State to Props */
type StateProps = {
    search: ISearchState;
};

/* Mapped Dispatches to Props */
type DispatchProps = {
    actions: {
        search: {
            searchAtoms: (filters: any) => void;
        }
    };
};


/***********************************************/
/*              CLASS DEFINITION               */
/***********************************************/
class AtomCategoryFilterContainer 
extends React.Component<ChildProps<AtomCategoryFilterProps & StateProps & DispatchProps, GetAllResponse>, LocalStates> {
    
    
    /********************************/
    /*         CONSTRUCTOR          */
    /********************************/
    constructor() {
        super();

        // Init state
        this.state = {
            value: '0'
        };

        // Bind methods
        this._handleChange = this._handleChange.bind(this);
    }


    /********************************/
    /*       PRIVATE METHODS        */
    /********************************/

    /**
     * @desc Handle Select List Change
     * @method _handleChange
     * @example this._handleChange()
     * @private 
     * @returns {void}
     */
    private _handleChange (e: any) {
        // catch value
        let value = e.target.value;

        // Parse to Int if value is String
        if (typeof value === 'string') {
            // tslint:disable-next-line:radix
            parseInt(value);
        }

        // Build the filter set
        // TODO: Typarlo, ya que esta estructura la uso a traves de muchos componentes
        let filters = {
            searchTerm: this.props.search.searchTerm,
            atomCategoryId: value,
            sortBy: this.props.search.sortBy
        };

        // update the state
        this.setState((previousState) => {
            return { ...previousState, value };
        });
        
        // Trigger Search Atoms Action
        this.props.actions.search.searchAtoms(filters);
    }

    
    /********************************/
    /*        RENDER MARKUP         */
    /********************************/
    render() {

        /*       PROPERTIES       */
        /**************************/
        const {...data} = this.props.data;
        
        
        /*       VALIDATIONS       */
        /***************************/
        if (data.loading) {
            return (<option>loading</option>);
        }

        /* TODO: Gestionar error
        if (data.error) {
            return (<p>{data.error.message}</p>);
        }

        if (data.allAtomCategories === null) {
            return (<div>No data</div>);
        }
        */
            
        
        /*         MARKUP          */
        /***************************/
        return (
            <div className="AtomCategoryFilter">
                <div className="sp-select-container mr-4">
                    <select value={this.state.value} onChange={this._handleChange}
                            className="sp-select sp-select--md sp-select--input"
                            name="categories">
                        <option key="0" value="0">All</option>
                        {data.allAtomCategories.map((atom: AtomCategoryModel) => (
                            <option key={atom.id} value={atom.id}>{atom.name}</option>    
                        ))}
                    </select>
                    <Icon icon="chevronDown"
                        iconClass="icon stroke-secondary strokeWidth-3 ml-1"
                        width="15" height="15"/>
                </div>
            </div>
        );

    }

}


/********************************/
/*            QUERY             */
/********************************/
const getAllAtomCategoriesQuery = graphql<GetAllResponse, AtomCategoryFilterProps>(
    GET_ALL_ATOM_CATEGORIES_QUERY
);


/********************************/
/*      MAP STATE TO PROPS      */
/********************************/
function mapStateToProps(state: IRootState): StateProps {
    return {
        search: state.search
    };
}


/********************************/
/*     MAP DISPATCH TO PROPS    */
/********************************/
function mapDispatchToProps(dispatch: Dispatch<IRootState>): DispatchProps {
    return {
        actions: {
            search: {
                searchAtoms: (filters: any) => dispatch(searchAtomsAction(filters))
            }
        }
    };
}


/********************************/
/*         REDUX CONNECT        */
/********************************/
const atomCategoryFilterConnect = connect(mapStateToProps, mapDispatchToProps); 


/*         EXPORT          */
/***************************/
export default compose(
    getAllAtomCategoriesQuery,
    atomCategoryFilterConnect
)(AtomCategoryFilterContainer);