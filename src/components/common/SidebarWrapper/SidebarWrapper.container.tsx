/********************************/
/*         DEPENDENCIES         */
/********************************/
import * as React from 'react';
import { ChildProps } from 'react-apollo';

import { functionsUtil } from '../../../core/utils/functionsUtil';

import Icon from '../Icon/Icon';
import ComponentsSection from './ComponentsSection/ComponentsSection';
import ProjectsListSection from './ProjectsListSection/ProjectsListSection';
import ProjectDetailsSection from './ProjectDetailsSection/ProjectDetailsSection';


// -----------------------------------


/********************************/
/*      INTERFACES & TYPES      */
/********************************/

/* Own Props */
type SidebarWrapperProps = {};

/* Own States */
type LocalStates = {
    visible: boolean
};

/* Mapped State to Props */
type StateProps = {};


/***********************************************/
/*              CLASS DEFINITION               */
/***********************************************/
class SidebarWrapper
extends React.Component<ChildProps<SidebarWrapperProps & StateProps, {}>, LocalStates> {
    
    
    /********************************/
    /*         CONSTRUCTOR          */
    /********************************/
    constructor(props: ChildProps<SidebarWrapperProps & StateProps, {}>) {
        super(props);

        // LOG
        functionsUtil.consoleLog('SidebarWrapper container actived');

        // Init state
        this.state = {
            visible: true
        };

        // Bind methods
        this._handleToggleClick = this._handleToggleClick.bind(this);
    }


    /********************************/
    /*       PRIVATE METHODS        */
    /********************************/

    /**
     * @desc Handle Toggle click
     * @method _handleToggleClick
     * @example this._handleToggleClick()
     * @private
     * @param {any} e - Event
     * @returns {void}
     */
    private _handleToggleClick(e: any) {
        // Update the state
        this._toggleVisibility();
    }


    /**
     * @desc Toggle visibility
     * @method _toggleVisibility
     * @example this._toggleVisibility()
     * @private
     * @returns {void}
     */
    private _toggleVisibility() {
        // Update the state
        this.setState({ 
            visible: !this.state.visible
        });
    }

    
    /********************************/
    /*        RENDER MARKUP         */
    /********************************/
    render() {
         
        
        /*         MARKUP          */
        /***************************/
        return (
            <div className="SidebarWrapper">
                <div className="Sidebar">

                    {/* Sidebar Header */}
                    <div className="Sidebar__header px-3 mt-3">
                        {/* Logo */}
                        <a className="sp-logo sp-logo--sm sp-logo--white m-0 link-reset" href="/">
                            <Icon icon="logo" 
                                iconClass="mr-2"
                                width="20" height="20"/>
                            <span>Stylepill</span>
                        </a>
                    </div>

                    <div className="divider m-3" />

                    {/* Sidebar Content */}
                    <div className="Sidebar__content">

                        {/* Components Section */}
                        <ComponentsSection />

                        <div className="divider m-3 mt-4" />

                        {/* Projects List Section */}
                        <ProjectsListSection />

                        {/* Project Details Section */}
                        <ProjectDetailsSection />

                    </div>

                    {/* Sidebar Footer */}
                    <div className="Sidebar__footer">
                        <div className="Sidebar__footer__btn d-flex align-items-center sp-bg-black p-4">
                            <Icon icon="plus"
                                    iconClass="stroke-white strokeWidth-5"
                                    width="20" height="20"/>
                            <span className="fontSize-md fontWeight-6 ml-2">
                                New component
                            </span>
                        </div>
                    </div>

                </div>
                <div className="MainContainer">
                    {this.props.children}
                </div>
            </div>
        );

    }

}


/*         EXPORT          */
/***************************/
export default SidebarWrapper;