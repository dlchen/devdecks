import * as React from "react";
import * as ReactDOM from "react-dom";
import { connect } from 'react-redux';
import { updateCurrentSlide } from '../../actions/slides.actions';
import { setActivePlugin } from '../../actions/app.actions';
import './current-slide-view.scss';

const Rnd = require('react-rnd');

// import {
//   OptionsBar,
// } from '..';

interface CurrentSlideProps {
  currentSlide?: any;
  currentSelectedPlugin?: any,
  isInPresenterMode?: boolean;
  setActivePlugin?: Function;
  slideNumber?: number;
  updateCurrentSlide?: Function;
}

// RND RESIZE
interface IDimension {
  height: number;
  width: number;
}

// Line 18: TODO: Dymically produce plugin types
class CurrentSlideViewComponent extends React.Component<CurrentSlideProps, { editSlideViewEl: any }> {
  public constructor() {
    super();
    this.state = {
      editSlideViewEl: null,
    };
  }
  
  // NOTE: This state is neeeded because we cannot access the DOM until the render method
  // Perhaps there is a better way
  public componentDidMount() {
    this.setState({ editSlideViewEl: document.getElementById('edit-slide-view') });
  }

  public render() {
    const { currentSelectedPlugin, currentSlide, isInPresenterMode, setActivePlugin, slideNumber, updateCurrentSlide } = this.props;
    const { editSlideViewEl } = this.state;
    return (
      <div>
        {
          currentSlide.plugins.map((plugin: any, key: number) => {
            const { component: Plugin, state: { width, height, left: x, top: y } } = plugin;
            return (
              <Rnd
                key={ key }
                className='rnd'
                initial={ {
                  width,
                  height,
                  x: x ? x : 0,
                  y: y ? y : 0
                } }
                // Ensure the DOM is ready when switching views so have access
                // to the edit-slide-view div
                bounds={ editSlideViewEl ? {
                  top: 0,
                  right: isInPresenterMode ? y : editSlideViewEl.clientWidth - width,
                  bottom: isInPresenterMode ? x : editSlideViewEl.clientHeight - height,
                  left: 0
                } : { } }
                isResizable= { isInPresenterMode ? {
                  top: false,
                  right: false,
                  bottom: false,
                  left: false,
                  topRight: false,
                  bottomRight: false,
                  bottomLeft: false,
                  topLeft: false
                } : {
                  top: false,
                  right: true,
                  bottom: true,
                  left: false,
                  topRight: false,
                  bottomRight: true,
                  bottomLeft: false,
                  topLeft: false
                } }
                onClick={ () => setActivePlugin(key, slideNumber) }
                onResizeStop={ (direction: string, styleSize: Object, clientSize: Object) => updateCurrentSlide(key, slideNumber, clientSize) }
                onDragStop={ (e: any, { position }: { position: Object }) => updateCurrentSlide(key, slideNumber, position) }
              >
                {/*<OptionsBar 
                  currentSelectedPlugin={ currentSelectedPlugin }
                  isInPresenterMode={ isInPresenterMode }
                  pluginNumber={ key }
                  pluginState={ currentSlide.plugins[key].state } 
                  slideNumber={ slideNumber } 
                  updateCurrentSlide={ updateCurrentSlide } />*/}
                <Plugin 
                  width={ width }
                  height={ height }
                  currentSlide={ currentSlide }
                  pluginNumber={ key }
                  pluginState={ currentSlide.plugins[key].state }
                  slideNumber={ slideNumber }
                  updateCurrentSlide={ updateCurrentSlide } />
              </Rnd>
            );
        })}
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  currentSlide: state.slides[state.app.currentSlide],
  currentSelectedPlugin: state.app.currentSelectedPlugin,
  isInPresenterMode: state.app.isFullscreen,
  slideNumber: state.app.currentSlide,
});

const mapDispatchToProps = (dispatch: any) => ({
  setActivePlugin: (pluginNumber: number, slideNumber: number) => dispatch(setActivePlugin(pluginNumber, slideNumber)),
  updateCurrentSlide: (pluginNumber: number, slide: number, changes: Object) => dispatch(updateCurrentSlide(pluginNumber, slide, changes)),
});

const CurrentSlideView = connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentSlideViewComponent as any);

export { CurrentSlideView };