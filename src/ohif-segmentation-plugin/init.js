import { store, register, addTool } from "cornerstone-tools";
import freehand3DModule from "./modules/freehand3DModule.js";
import extendBrushModule from "./modules/extendBrushModule.js";

import Brush3DTool from "./tools/Brush3DTool.js";
import Brush3DHUGatedTool from "./tools/Brush3DHUGatedTool.js";
import Brush3DAutoGatedTool from "./tools/Brush3DAutoGatedTool.js";
import FreehandRoi3DTool from "./tools/FreehandRoi3DTool.js";
import FreehandRoi3DSculptorTool from "./tools/FreehandRoi3DSculptorTool.js";

let TOOL_NAMES = {};

export { TOOL_NAMES };

const modules = store.modules;

const defaultConfig = {
  maxRadius: 64,
  holeFill: 2,
  holeFillRange: [0, 20],
  strayRemove: 5,
  strayRemoveRange: [0, 99],
  interpolate: true,
  showFreehandStats: false,
  brush3dToolName: "Brush3DTool",
  brush3DHUGatedToolName: "Brush3DHUGatedTool",
  brush3DAutoGatedTool: "Brush3DAutoGatedTool",
  freehandRoi3DTool: "FreehandRoi3DTool",
  freehandRoi3DSculptorTool: "FreehandRoi3DSculptorTool",
  gates: [
    {
      // https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4309522/
      name: "adipose",
      range: [-190, -30],
      displayName: "Adipose"
    },
    {
      // https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4309522/
      name: "muscle",
      range: [-29, 150],
      displayName: "Muscle"
    },
    {
      name: "bone",
      range: [250, 3071],
      displayName: "Bone"
    },
    {
      name: "fat",
      range: [-200, -6],
      displayName: "Fat"
    },
    {
      name: "softTissue",
      range: [-700, 125],
      displayName: "Soft Tissue"
    },
    {
      name: "airDensity",
      range: [-1000, -950],
      displayName: "Air Density"
    },
    {
      name: "custom",
      range: [0, 100],
      displayName: "Custom"
    }
  ]
};

export default function init(configuration = {}) {
  console.log("Triggered");
  const brushModule = modules.brush;
  const config = Object.assign({}, defaultConfig, configuration);

  extendBrushModule(brushModule, config);

  register("module", "freehand3D", freehand3DModule);
  const freehand3DStore = modules.freehand3D;

  freehand3DStore.state.interpolate = config.interpolate;
  freehand3DStore.state.displayStats = config.showFreehandStats;

  addTool(Brush3DTool, { name: config.brush3dToolName });
  console.log("store is", store);
  console.log("Add Tool", addTool);
  // debugger;
  addTool(Brush3DHUGatedTool, { name: config.brush3DHUGatedToolName });
  addTool(Brush3DAutoGatedTool, { name: config.brush3DAutoGatedTool });
  addTool(FreehandRoi3DTool, { name: config.freehandRoi3DTool });
  addTool(FreehandRoi3DSculptorTool, {
    name: config.freehandRoi3DSculptorTool,
    referencedToolName: config.freehandRoi3DTool
  });

  console.log("Hadi bakalim", store);

  // TODO -> Clean this up a bit after PW.
  TOOL_NAMES.FREEHAND_ROI_3D_TOOL = config.freehandRoi3DTool;
  TOOL_NAMES.FREEHAND_ROI_3D_SCULPTOR_TOOL = config.freehandRoi3DSculptorTool;
  TOOL_NAMES.BRUSH_3D_TOOL = config.brush3dToolName;
  TOOL_NAMES.BRUSH_3D_AUTO_GATED_TOOL = config.brush3DAutoGatedTool;
  TOOL_NAMES.BRUSH_3D_HU_GATED_TOOL = config.brush3DHUGatedToolName;

  console.log("Konfig geliyo", config);

  console.log(TOOL_NAMES);
}
