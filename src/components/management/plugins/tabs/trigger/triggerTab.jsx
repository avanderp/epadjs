import React from "react";
import ReactTable from "react-table";
import { FaRegTrashAlt } from "react-icons/fa";

import {
  getDockerImages,
  getAnnotationTemplates,
  getAnnotationProjects,
  addPluginsToQueue,
} from "../../../../../services/pluginServices";
import TemplateColumn from "./templateColumn";
import ProjectColumn from "./projectColumn";
import AnnotationColumn from "./annotationColumn";

class TriggerTab extends React.Component {
  state = {
    plImages: {},
    plContainers: {},
    selectedTemplates: [],
    selectedProjects: [],
    selectedAnnotations: [],
    selectAll: 0,
    templates: [],
    projects: [],
    annotations: [],
  };

  componentDidMount = async () => {
    //const tempPlImages = await getDockerImages();
    //this.setState({ plImages: tempPlImages });
    const tempTemplates = await getAnnotationTemplates();
    const tempProjects = await getAnnotationProjects();
    this.setState({ templates: tempTemplates.data });
    this.setState({ projects: tempProjects.data });
  };

  handleSelectRow = (id) => {};
  handleSelectAll = () => {};
  handleDeleteOne = (rowdata) => {};

  handleProjectOnChange = (projectid) => {
    let tempSelProjects = this.state.selectedProjects;
    // tempSelProjects.push(projectid);

    /////////////////////
    let elementIndex = tempSelProjects.indexOf(projectid);
    if (elementIndex === -1) {
      tempSelProjects.push(projectid);
    } else {
      tempSelProjects = this.state.selectedProjects.filter((id) => {
        console.log("filter projectids", projectid);
        return id !== projectid;
      });
    }
    this.setState({ selectedProjects: tempSelProjects });
  };
  handleTemplateOnChange = (templateid) => {
    const tempSelTemplates = this.state.selectedTemplates;
    tempSelTemplates.push(templateid);
    this.setState({ selectedTemplates: tempSelTemplates });
  };
  componentDidUpdate() {
    console.log(
      "componant updated -->selecetd projects",
      this.state.selectedProjects
    );
    console.log(
      "componant updated -->selecetd templates",
      this.state.selectedTemplates
    );
  }
  handleTriggerPlugin = async () => {
    // no need this getPluginsProjectsWithParameters, instead write start queue function with selected project, template, aims and logged user
    console.log("trigger clicked");
    console.log("selectedTemplates : ", this.state.selectedTemplates);
    console.log("selectedProjects : ", this.state.selectedProjects);
    console.log("selectedAnnotations : ", this.state.selectedAnnotations);
    const projectids = [...this.state.selectedProjects];
    const templateids = [...this.state.selectedTemplates];
    const annotationuids = [...this.state.selectedAnnotations];
    const responseAddPluginsToQueue = await addPluginsToQueue({
      projectids,
      templateids,
      annotationuids,
    });
    console.log("responseAddPluginsToQueue : ", responseAddPluginsToQueue);
  };
  render() {
    return (
      <div>
        {/* <div className="create-user__modal--buttons">
          <button
            variant="primary"
            className="btn btn-sm btn-outline-light"
            onClick={this.handleTriggerPlugin}
          >
            Trigger
          </button>
          <button variant="secondary" className="btn btn-sm btn-outline-light">
            Clear
          </button>
        </div> */}

        <div className="row">
          <ProjectColumn
            projects={this.state.projects}
            onChange={this.handleProjectOnChange}
          />
          {/* <TemplateColumn
            templates={this.state.templates}
            onChange={this.handleTemplateOnChange}
          />
          <AnnotationColumn
            templates={this.state.annotations}
            onChange={this.handleAnnotationsOnChange}
          /> */}
        </div>
      </div>
    );
  }
}

export default TriggerTab;
