import React, { Component } from "react";
import Toolbar from "./toolbar";
import { getImageIds } from "../../services/seriesServices";
//import Viewport from "./viewport.jsx";
import ViewportSeg from "./viewportSeg.jsx";
import { connect } from "react-redux";
import { wadoUrl } from "../../config.json";
import { withRouter } from "react-router-dom";
import CornerstoneViewport from "react-cornerstone-viewport";
import "./flex.css";
//import viewport from "./viewport.jsx";
import { FiZoomIn } from "react-icons/fi";
import { TiScissors } from "react-icons/ti";

const mapStateToProps = state => {
  return {
    series: state.searchViewReducer.series,
    cornerstone: state.searchViewReducer.cornerstone,
    cornerstoneTools: state.searchViewReducer.cornerstoneTools
    //refs: state.searchViewReducer.viewports
  };
};

class DisplayView extends Component {
  constructor(props) {
    super(props);
    this.csTools = this.props.cornerstoneTools;
    this.child = React.createRef();
    this.state = {
      series: props.series,
      width: "100%",
      height: "calc(100% - 60px)",
      refs: props.refs,
      hiding: false,
      data: [
        {
          stack: {
            currentImageIdIndex: 0,
            imageIds: [
              "wadouri:http://epad-dev6.stanford.edu:8080/epad/wado/?requestType=WADO&studyUID=1.2.840.113619.2.55.1.1762384564.2037.1100004161.949&seriesUID=1.2.840.113619.2.55.1.1762384564.2037.1100004161.950&objectUID=1.3.12.2.1107.5.8.2.484849.837749.68675556.2004110916031631&contentType=application%2Fdicom",
              "wadouri:http://epad-dev6.stanford.edu:8080/epad/wado/?requestType=WADO&studyUID=1.2.840.113619.2.55.1.1762384564.2037.1100004161.949&seriesUID=1.2.840.113619.2.55.1.1762384564.2037.1100004161.950&objectUID=1.3.12.2.1107.5.8.2.484849.837749.68675556.2004110916031802&contentType=application%2Fdicom"
            ]
          }
        }
      ]
    };
    //this.createRefs();
    //console.log(this.state);
  }

  componentDidMount() {
    //document.body.classList.add("fixed-page");
    this.getViewports();
    // this.getData();
    const vpList = document.getElementsByClassName("cs");
    const ZoomTool = this.props.cornerstoneTools.ZoomTool;
    //check the logic here
    /*for (var i = 0; i < vpList.length; i++) {
      this.props.cornerstoneTools.zoom.activate(vpList[i], 5);
    }*/
    this.props.cornerstoneTools.setToolActive(ZoomTool.name, {
      mouseButtonMask: 5
    });
    //make the last element in series as selected viewport since the last open will be added to end
    this.props.dispatch(
      this.defaultSelectVP("viewport" + (this.state.series.length - 1))
    );
    //console.log(viewports);
    //viewports.map(vp => this.props.cornerstoneTools.wwwc.activate(vp, 1));
    //this.props.cornerstoneTools.wwwc.activate(this.state.refs[0], 1);
  }

  /*testAimEditor = () => {
    console.log(document.getElementById("cont"));
    var instanceAimEditor = new aim.AimEditor(document.getElementById("cont"));
    var myA = [
      { key: "BeaulieuBoneTemplate_rev18", value: aim.myjson },
      { key: "asdf", value: aim.myjson1 }
    ];
    instanceAimEditor.loadTemplates(myA);

    instanceAimEditor.addButtonsDiv();

    instanceAimEditor.createViewerWindow();
  };*/
  getData() {
    for (let i = 0; i < this.state.series.length; i++) {
      console.log("serie", this.state.series[i]);
      this.getImages(this.state.series[i]);
    }
  }

  async getImages(seri) {
    let stack = {};
    let tempArray = [];
    const {
      data: {
        ResultSet: { Result: urls }
      }
    } = await getImageIds(seri); //get the Wado image ids for this series
    urls.map(url => {
      if (url.multiFrameImage === true) {
        for (var i = 0; i < url.numberOfFrames; i++) {
          tempArray.push(
            wadoUrl +
              url.lossyImage +
              "&contentType=application%2Fdicom?frame=" +
              i
          );
        }
      } else
        tempArray.push(
          wadoUrl + url.lossyImage + "&contentType=application%2Fdicom"
        );
    });
    stack.currentImageIdIndex = 0;
    stack.imageIds = [...tempArray];
    console.log(JSON.stringify(stack));
    this.setState({
      data: [...this.state.data, stack]
    });
  }

  getViewports = () => {
    let numSeries = this.state.series.length;
    let numCols = numSeries % 3;
    if (numSeries > 3) {
      this.setState({ height: "calc((100% - 60px)/2)" });
      this.setState({ width: "33%" });
      return;
    }
    if (numCols === 1) {
      this.setState({ width: "100%" });
    } else if (numCols === 2) this.setState({ width: "50%" });
    else this.setState({ width: "33%" });
  };

  createRefs() {
    this.state.series.map(() =>
      this.props.dispatch(this.createViewport(React.createRef()))
    );
  }

  createViewport(viewportRef) {
    return {
      type: "CREATE_VIEWPORT",
      payload: viewportRef
    };
  }

  defaultSelectVP(id) {
    return {
      type: "SELECT_VIEWPORT",
      payload: id
    };
  }

  hideShow = current => {
    const elements = document.getElementsByClassName("viewportContainer");
    if (this.state.hiding === false) {
      for (var i = 0; i < elements.length; i++) {
        if (i != current) elements[i].style.display = "none";
      }
      this.setState({ height: "calc(100% - 60px)", width: "100%" });
    } else {
      this.getViewports();
      for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = "inline-block";
      }
    }
    this.setState({ hiding: !this.state.hiding }, () =>
      window.dispatchEvent(new Event("resize"))
    );

    /*const elem = document.getElementById("viewport" + current);
    console.log(elem);
    this.props.cornerstone.fitToWindow(elem);*/
  };

  render() {
    return (
      <React.Fragment>
        <Toolbar />

        {this.state.series.map((serie, i) => (
          <div
            className={"viewportContainer"}
            key={i}
            style={{
              width: this.state.width,
              height: this.state.height,
              padding: "2px",
              display: "inline-block"
            }}
            onDoubleClick={() => this.hideShow(i)}
          >
            {/* <ViewportSeg
              key={serie.seriesId}
              id={"viewport" + i}
              cs={this.props.cornerstone}
              csT={this.props.cornerstoneTools}
              setClick={click => (this.updateViewport = click)}
              serie={serie}
            />*/}
            <CornerstoneViewport
              viewportData={this.state.data[0]}
              cornerstone={this.props.cornerstone}
              cornerstoneTools={this.props.cornerstoneTools}
            />
          </div>
        ))}
        <div id="cont" />
      </React.Fragment>
    );
  }
}

export default withRouter(connect(mapStateToProps)(DisplayView));
