// @ts-nocheck
import dicomParser from 'dicom-parser';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import Hammer from 'hammerjs';

export function initCornerstone() {
  // Cornertone Tools
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.Hammer = Hammer;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

  cornerstoneTools.init({
    mouseEnabled: true,
    touchEnabled: true,
    globalToolSyncEnabled: true,
    showSVGCursors: true,
  });

  // Preferences
  const fontFamily =
    'Work Sans, Roboto, OpenSans, HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif';
  cornerstoneTools.textStyle.setFont(`16px ${fontFamily}`);
  cornerstoneTools.toolStyle.setToolWidth(2);
  cornerstoneTools.toolColors.setToolColor('rgb(255, 255, 0)');
  cornerstoneTools.toolColors.setActiveColor('rgb(0, 255, 0)');

  cornerstoneTools.store.state.touchProximity = 40;

  const OverlayTool = cornerstoneTools.OverlayTool;
  cornerstoneTools.addTool(OverlayTool);
  cornerstoneTools.setToolEnabled('Overlay', {});

  // IMAGE LOADER
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstoneWADOImageLoader.webWorkerManager.initialize({
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: true,
    taskConfiguration: {
      decodeTask: {
        initializeCodecsOnStartup: false,
        usePDFJS: false,
        strict: false,
      },
    },
  });

  // Navigation Tools
  const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;
  const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool;

  const PanTool = cornerstoneTools.PanTool;
  const ZoomTool = cornerstoneTools.ZoomTool;
  const MagnifyTool = cornerstoneTools.MagnifyTool;
  const WwwcTool = cornerstoneTools.WwwcTool;

  // Measurement Tools
  const LengthTool = cornerstoneTools.LengthTool;
  const RectangleRoiTool = cornerstoneTools.RectangleRoiTool;
  const EllipticalRoiTool = cornerstoneTools.EllipticalRoiTool;
  const AngleTool = cornerstoneTools.AngleTool;
  const ProbeTool = cornerstoneTools.ProbeTool;
  const BidirectionalTool = cornerstoneTools.BidirectionalTool;
  const CobbAngleTool = cornerstoneTools.CobbAngleTool;

  // Annotation Tools
  const ArrowAnnotateTool = cornerstoneTools.ArrowAnnotateTool;
  const TextMarkerTool = cornerstoneTools.TextMarkerTool;

  // Segmentation Tools
  const RectangleScissorsTool = cornerstoneTools.RectangleScissorsTool;
  const SphericalBrushTool = cornerstoneTools.SphericalBrushTool;
  const FreehandScissorsTool = cornerstoneTools.FreehandScissorsTool;
  const BrushTool = cornerstoneTools.BrushTool;

  // Additional Tools
  const EraserTool = cornerstoneTools.EraserTool;
  const DragProbeTool = cornerstoneTools.DragProbeTool;
  const CircleRoiTool = cornerstoneTools.CircleRoiTool;

  // Adding Tools
  cornerstoneTools.addTool(StackScrollMouseWheelTool);
  cornerstoneTools.addTool(PanTool);
  cornerstoneTools.addTool(ZoomTool);
  cornerstoneTools.addTool(MagnifyTool);
  cornerstoneTools.addTool(WwwcTool);
  cornerstoneTools.addTool(LengthTool);
  cornerstoneTools.addTool(RectangleRoiTool);
  cornerstoneTools.addTool(EllipticalRoiTool);
  cornerstoneTools.addTool(AngleTool);
  cornerstoneTools.addTool(ProbeTool);
  cornerstoneTools.addTool(BidirectionalTool);
  cornerstoneTools.addTool(CobbAngleTool);
  cornerstoneTools.addTool(ArrowAnnotateTool);
  cornerstoneTools.addTool(TextMarkerTool, {
    markers: ['F5', 'F4', 'F3', 'F2', 'F1'],
    current: 'F5',
    ascending: true,
    loop: true,
    hasTextBox: true, // Add this line
  });
  cornerstoneTools.addTool(RectangleScissorsTool);
  cornerstoneTools.addTool(FreehandScissorsTool);
  cornerstoneTools.addTool(BrushTool);
  cornerstoneTools.addTool(SphericalBrushTool);
  cornerstoneTools.addTool(EraserTool);
  cornerstoneTools.addTool(DragProbeTool);
  cornerstoneTools.addTool(CircleRoiTool);

  cornerstoneTools.addTool(ZoomMouseWheelTool);
  cornerstoneTools.setToolActive('StackScrollMouseWheel', {});
  cornerstoneTools.setToolActive('Pan', {
    mouseButtonMask: 1,
  });
}
