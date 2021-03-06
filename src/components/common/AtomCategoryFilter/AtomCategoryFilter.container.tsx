/********************************/
/*         DEPENDENCIES         */
/********************************/
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { graphql, compose, ChildProps } from 'react-apollo';
import { Popup } from 'semantic-ui-react';

import { GET_ALL_ATOM_CATEGORIES_QUERY, GetAllResponse } from '../../../models/atomCategory/atomCategory.query';
import { AtomCategory as AtomCategoryModel } from '../../../models/atomCategory/atomCategory.model';

import { IRootState } from '../../../reducer/reducer.config';
import { ISearchState } from '../../../reducer/search.reducer';

import { searchAtomsAction } from '../../../actions/search.action';
import { clearPaginationAction } from '../../../actions/pagination.action';

import Icon from './../../../app/components/Icon/Icon';


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
            searchAtoms: (filters: ISearchState) => void;
        },
        pagination: {
            clearPagination: () => void;
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
    constructor(props: ChildProps<AtomCategoryFilterProps & StateProps & DispatchProps, GetAllResponse>) {
        super(props);

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
     * @param {AtomModel} atom - atom data
     * @param {any} e - Event
     * @returns {void}
     */
    private _handleChange (e: any) {
        // VARIABLES
        let value = e.target.value;
        let queryArgs: ISearchState = null;

        // Destructuring props
        const { filter, sortBy } = this.props.search.searchAtoms;
        const { type, text } = filter;
        const { isDuplicated, isPrivate } = type;

        // CONSTANTS
        const RADIX = 10;


        // Parse to Int if value is String
        if (typeof value === 'string') {
            parseInt(value, RADIX);
        }

        // Build the filter set
        queryArgs = {
            searchAtoms: {
                filter: {
                    type: {
                        isDuplicated,
                        isPrivate
                    },
                    text,
                    atomCategoryId: value
                },
                sortBy
            }
        };

        // Update the state
        this.setState((previousState) => {
            return { ...previousState, value };
        });

        // Trigger Clean Pagination Action
        this.props.actions.pagination.clearPagination();
        
        // Trigger Search Atoms Action
        this.props.actions.search.searchAtoms(queryArgs);
    }


    /**
     * @desc Get Categories Filter List
     * @method _getCategoriesFilterList
     * @example this._getCategoriesFilterList(categories)
     * @private
     * @param data - all Atom Categories
     * @returns {JSX.Element} <Popup />
     */
    private _getCategoriesFilterList (categories: Array<AtomCategoryModel> = []): JSX.Element {
        return (
            <Popup
            trigger={
                <div className="sp-select-container">
                    <select value={this.state.value} onChange={this._handleChange}
                            className="sp-select sp-select--md sp-select--input"
                            name="categories">
                        <option key="0" value="0">All</option>
                        {categories.map((atom: AtomCategoryModel) => (
                            <option key={atom.id} value={atom.id}>{atom.name}</option>    
                        ))}
                    </select>
                    <Icon icon="chevronDown"
                        iconClass="icon stroke-secondary strokeWidth-3 ml-1"
                        width="15" height="15"/>
                </div>
            }
            position="top center"
            size="tiny"
            inverted={true}>
                Filter by category
            </Popup>
        );
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
            
        
        /*         MARKUP          */
        /***************************/
        return (
            <div className="AtomCategoryFilter">
                {this._getCategoriesFilterList(data.allAtomCategories)}
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
                // TODO: Agregar el tipo correspondiente
                searchAtoms: (queryArgs: any) => dispatch(searchAtomsAction(queryArgs))
            },
            pagination: {
                clearPagination: () => dispatch(clearPaginationAction())
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