/********************************/
/*         DEPENDENCIES         */
/********************************/
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { compose, ChildProps } from 'react-apollo';
import { Popup } from 'semantic-ui-react';

import * as appConfig from '../../../core/constants/app.constants';

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
type SortBySelectListProps = {};

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
class SortBySelectListContainer 
extends React.Component<ChildProps<SortBySelectListProps & StateProps & DispatchProps, {}>, LocalStates> {
    
    
    /********************************/
    /*         CONSTRUCTOR          */
    /********************************/
    constructor(props: ChildProps<SortBySelectListProps & StateProps & DispatchProps, {}>) {
        super(props);

        // Init state
        this.state = {
            value: appConfig.ATOM_SEARCH_ORDER_BY_DEFAULT
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
     * @param {any} e - Event
     * @returns {void}
     */
    private _handleChange (e: any) {
        // VARIABLES
        let value = e.target.value;
        let queryArgs: ISearchState = null;

        // Destructuring props
        const { filter } = this.props.search.searchAtoms;
        const { type, text, atomCategoryId } = filter;
        const { isDuplicated, isPrivate } = type;

        // Build the filter set
        queryArgs = {
            searchAtoms: {
                filter: {
                    type: {
                        isDuplicated,
                        isPrivate
                    },
                    text,
                    atomCategoryId
                },
                sortBy: value
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
     * @desc Get Sort by List
     * @method _getSortByList
     * @example this._getSortByList()
     * @private
     * @returns {JSX.Element} <Popup />
     */
    private _getSortByList (): JSX.Element {
        return (
            <Popup
            trigger={
                <div className="sp-select-container">
                    <select value={this.state.value} onChange={this._handleChange}
                            className="sp-select sp-select--md sp-select--input"
                            name="sortBy">
                        {/* TODO: Hacer de este select list un enum (usar mismos nombres que en BE) */}
                        <option value="created_at">Recent</option>
                        <option value="likes">Likes</option>
                        <option value="stores">Duplicated</option>
                    </select>
                    <Icon icon="chevronDown"
                        iconClass="icon stroke-secondary strokeWidth-3 ml-1"
                        width="15" height="15"/>
                </div>
            }
            position="top center"
            size="tiny"
            inverted={true}>
                Sort by
            </Popup>
        );
    }

    
    /********************************/
    /*        RENDER MARKUP         */
    /********************************/
    render() {
            
        
        /*         MARKUP          */
        /***************************/
        return (
            <div className="SortBySelectList">
                {this._getSortByList()}
            </div>
        );

    }

}


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
const sortBySelectListConnect = connect(mapStateToProps, mapDispatchToProps); 


/*         EXPORT          */
/***************************/
export default compose(
    sortBySelectListConnect
)(SortBySelectListContainer);