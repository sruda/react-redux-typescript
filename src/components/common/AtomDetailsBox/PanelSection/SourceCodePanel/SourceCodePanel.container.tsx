/************************************/
/*           DEPENDENCIES           */
/************************************/
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { compose, ChildProps } from 'react-apollo';

import { functionsUtil } from '../../../../../core/utils/functionsUtil';

import { IRootState } from './../../../../../reducer/reducer.config';

import { changeSourceCodeTabAction } from './../../../../../actions/ui.action';
import { changedAtomDetailsAction, requestEditAtomAction } from './../../../../../actions/atom.action';

import CodeTabMenu, { 
    Option as CodeTabMenuOption 
} from './../../../../../app/components/Tabs/CodeTabMenu/CodeTabMenu';

import BtnGroup from './BtnGroup/BtnGroup';
import BannerAlert, { 
    Option as BannerAlertOption 
} from './../../../../../app/components/Alerts/BannerAlert/BannerAlert';
import * as CodeMirror from 'react-codemirror';
import 'codemirror/mode/css/css';
// TODO: Remover cuando no se necesite
// import 'codemirror/mode/sass/sass';
import 'codemirror/mode/xml/xml';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/theme/material.css';
import 'codemirror/addon/display/autorefresh';

// -----------------------------------


/********************************/
/*      INTERFACES & TYPES      */
/********************************/

/* Own Props */
type SourceCodePanelProps = {
    atomId: number,
    name: string,
    html: string,
    css: string
};

/* Own States */
type LocalStates = {
    copied: boolean,
    html: string,
    css: string,
    codeMirror: {
        readOnly: boolean
    }
};

/* Mapped State to Props */
type StateProps = {
    tab: CodeTabMenuOption;
    watchingChanges: boolean;
};

/* Mapped Dispatches to Props */
type DispatchProps = {
    actions: {
        ui: { 
            changeSourceCodeTab: (tab: CodeTabMenuOption) => void;
        },
        atomState: {
            changedAtomDetails: (id: number, name: string, codeType: string, codeProps: any) => void;
            activeEditMode: (id: number, name: string) => void;
        }
    };
};


/***********************************************/
/*              CLASS DEFINITION               */
/***********************************************/
class SourceCodePanel 
extends React.Component<ChildProps<SourceCodePanelProps & StateProps & DispatchProps, {}>, LocalStates> {


    /********************************/
    /*         CONSTRUCTOR          */
    /********************************/
    constructor(props: SourceCodePanelProps & StateProps & DispatchProps) {
        super(props);

        // LOG
        functionsUtil.consoleLog('AtomDetailsBox/PanelSection/SourceCodePanel container actived');

        // Init local state
        this.state = {
            copied: false,
            html: props.html,
            css: props.css,
            codeMirror: {
                readOnly: true
            }
        };

        // Bind methods
        this._handleTabClick = this._handleTabClick.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }


    /********************************/
    /*        PUBLIC METHODS        */
    /********************************/


    /**
     * @desc HandleOnChange
     * @method handleOnChange
     * @example this.handleOnChange()
     * @public
     * @param {string} type - source code type (e.g. 'html', 'css')
     * @param {string} newCode - new source code
     * @param {any} e - Event
     * @returns {void}
     */
    handleOnChange (newCode: string) {
        this._updateCode(this.props.tab, newCode);
    }
    

    /**********************************/
    /*  COMPONENT WILL RECEIVE PROPS  */
    /**********************************/
    componentWillReceiveProps(nextProps: SourceCodePanelProps & StateProps) {   

        if (this.props.watchingChanges !== nextProps.watchingChanges &&
            nextProps.watchingChanges) {
            
            // Active Edit Mode after launch user's action
            this.setState({
                codeMirror: {
                    readOnly: false
                }
            });

        }
    }


    /********************************/
    /*       PRIVATE METHODS        */
    /********************************/


    /**
     * @desc HandleTabClick
     * @method _handleTabClick
     * @example this._handleTabClick()
     * @private
     * @param {CodeTabMenuOption} tab - source code tab (e.g. 'html', 'js', 'css')
     * @param {React.FormEvent<{}>} e - Event
     * @returns {void}
     */
    private _handleTabClick = (tab: CodeTabMenuOption) => (e: React.FormEvent<{}>) => {
        e.preventDefault();
        this._changeTab(tab);
    }


    /**
     * @desc Change Tab
     * @method _changeTab
     * @example this._changeTab()
     * @private
     * @param {CodeTabMenuOption} tab - source code tab (e.g. 'html', 'js', 'css') 
     * @returns {void}
     */
    private _changeTab(tab: CodeTabMenuOption) {
        this.props.actions.ui.changeSourceCodeTab(tab);
    }


    /**
     * @desc Update Code
     * @method _updateCode
     * @example this._updateCode()
     * @private
     * @param {string} type - source code type (e.g. 'html', 'css')
     * @param {string} newCode - new source code
     * @returns {void}
     */
    private _updateCode(type: string, newCode: string) {
        // Destructuring props
        const { atomId, name } = this.props;
        
        // Update local state
        this.setState((previousState) => {
            return {
                ...previousState,
                [type]: newCode
            };
        }, () => {
            // Launch Atom details changed Action
            this.props.actions.atomState.changedAtomDetails(atomId, name, type, {code: newCode});
        });
        
    }


    /********************************/
    /*        RENDER MARKUP         */
    /********************************/
    render() {

        // Destructuring props & state
        const { atomId, name } = this.props;
        const { tab } = this.props;
        const { watchingChanges } = this.props;
        const { html, css } = this.state;

        // Code Mirror HTML default options
        const codeMirrorOptions = {
            scrollbarStyle: 'overlay',
            lineNumbers: true,
            readOnly: this.state.codeMirror.readOnly,
            mode: tab === CodeTabMenuOption.html ? 'xml' : CodeTabMenuOption.css,
            theme: 'material',
            autoRefresh: true
        };

        // VARIABLES
        let options: Array<CodeTabMenuOption> = [
            CodeTabMenuOption.html,
            CodeTabMenuOption.css
        ]; 


        /*         MARKUP          */
        /***************************/
        return (
            <div className="SourceCodePanel row no-gutters sp-bg-black borderTop-1 border-dark overflow-hidden">
            
                {/* Source Code Tab Menu */}
                <CodeTabMenu options={options} 
                             isReversed={true}
                             tab={tab} 
                             onTabClick={this._handleTabClick}/>

                {/* Source Code Panel */}
                <div className="row no-gutters w-100 sp-bg-mirage">
                    <div className="col-12 position-relative">

                        {/* Button Group */}
                        <BtnGroup atomId={atomId} 
                                  atomName={name} 
                                  atomHtml={html} 
                                  atomCss={css}
                                  currentTab={tab} />

                        {/* Source Code */}
                        <div className="SourceCode position-relative">
                            {tab === 'html' && <CodeMirror value={this.state.html} 
                                                            options={codeMirrorOptions} 
                                                            onChange={this.handleOnChange}/>}
                            {tab === 'css' && <CodeMirror value={this.state.css} 
                                                            options={codeMirrorOptions} 
                                                            onChange={this.handleOnChange}/>}
                        </div>

                    </div>

                    <div className="col-12 position-relative">

                        {/* Bottom Message */}
                        { watchingChanges && 
                            <BannerAlert type={BannerAlertOption.info} 
                                         text={`You can now edit the code live. To keep your changes, 
                                                duplicate the component by pressing Duplicate button.`}
                                         className={'position-absolute activeEditModeMessage'}/>
                        }
                    </div>
                </div>

            </div>
        );
    }

}


/********************************/
/*      MAP STATE TO PROPS      */
/********************************/
function mapStateToProps(state: IRootState): StateProps {
    
    const { tabs } = state.ui;
    const { sourceCodeTab } = tabs;
    const { tab } = sourceCodeTab;
    const { watchingChanges } = state.atomState.edited;

    return {
        tab,
        watchingChanges
    };
}


/********************************/
/*     MAP DISPATCH TO PROPS    */
/********************************/
function mapDispatchToProps(dispatch: Dispatch<IRootState>): DispatchProps {
    return {
        actions: {
            ui: {
                changeSourceCodeTab: (tab) => dispatch(changeSourceCodeTabAction(tab))
            },
            atomState: {
                changedAtomDetails: (id, name, codeType, codeProps) => dispatch(changedAtomDetailsAction(id, name, codeType, codeProps)),
                activeEditMode: (id, name) => dispatch(requestEditAtomAction(id, name))
            }
        }
    };
}


/********************************/
/*         REDUX CONNECT        */
/********************************/
const sourceCodePanelConnect = connect(mapStateToProps, mapDispatchToProps);


/*         EXPORT          */
/***************************/
export default compose(
    sourceCodePanelConnect
)(SourceCodePanel);