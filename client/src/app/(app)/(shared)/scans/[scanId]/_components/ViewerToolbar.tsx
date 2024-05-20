'use client';

import { ChangeEvent, useRef, useState } from 'react';
// @ts-ignore
import cornerstone from 'cornerstone-core';
// @ts-ignore
import cornerstoneTools from 'cornerstone-tools';
// @ts-ignore
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import {
  AArrowUp,
  Brush,
  Circle,
  CircleDot,
  Columns2,
  Contrast,
  DraftingCompass,
  Egg,
  Eraser,
  GalleryVerticalEnd,
  Grid2X2,
  LayoutGrid,
  LayoutPanelLeft,
  LayoutPanelTop,
  Move,
  Plus,
  RectangleHorizontal,
  RotateCcw,
  RotateCw,
  Rows2,
  Ruler,
  Save,
  ScissorsLineDashed,
  Search,
  SearchCode,
  Square,
  SquareIcon,
  Trash2,
  Type,
  Upload,
  ZoomIn,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import useViewerStore from '@/hooks/useViewerStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const tools = [
  // Navigation Tools
  [
    { name: 'Pan', tool: 'Pan', icon: Move },
    { name: 'Zoom', tool: 'Zoom', icon: ZoomIn },
    { name: 'Magnify', tool: 'Magnify', icon: Search },
    { name: 'Wwwc', tool: 'Wwwc', icon: Contrast },
    {
      name: 'Rotate',
      tool: 'Rotate',
      icon: RotateCw,
    },
  ],

  // Measurement Tools
  [
    { name: 'Length', tool: 'Length', icon: Ruler },
    { name: 'Rectangle', tool: 'RectangleRoi', icon: RectangleHorizontal },
    { name: 'Circle Roi', tool: 'CircleRoi', icon: Circle },
    { name: 'Ellipse', tool: 'EllipticalRoi', icon: Egg },
    { name: 'Angle', tool: 'Angle', icon: DraftingCompass },
    { name: 'Probe', tool: 'Probe', icon: CircleDot },
    {
      name: 'Bidirectional',
      tool: 'Bidirectional',
      icon: Plus,
    },
  ],

  // Annotation Tools
  [
    {
      name: 'Arrow Annotate',
      tool: 'ArrowAnnotate',
      icon: AArrowUp,
    },
    {
      name: 'Text Marker',
      tool: 'TextMarker',
      icon: Type,
    },
  ],
  [
    { name: 'Brush', tool: 'Brush', icon: Brush },
    {
      name: 'Rectangle Scissors',
      tool: 'RectangleScissors',
      icon: Square,
    },
    { name: 'Circle Scissors', tool: 'CircleScissors', icon: Circle },
    {
      name: 'Freehand Scissors',
      tool: 'FreehandScissors',
      icon: ScissorsLineDashed,
    },
  ],
  [{ name: 'Eraser', tool: 'Eraser', icon: Eraser }],
];

export default function ViewerToolbar() {
  const [activeTool, setActiveTool] = useState<string>('Pan');
  const [mouseWheelTool, setMouseWheelTool] = useState('StackScroll');
  const {
    currentViewerId,
    setCurrentViewerId,
    setFirstViewportsCount,
    setSecondViewportsCount,
    setSplitViewportsBy,
  } = useViewerStore();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const imageIds = files.map((file) => {
        return cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
      });

      const stack = {
        currentImageIdIndex: 0,
        imageIds,
      };
      const element = document.getElementById('viewer_' + currentViewerId);
      cornerstone.loadImage(imageIds[0]).then((image: any) => {
        cornerstone.displayImage(element, image);
        cornerstoneTools.addStackStateManager(element, ['stack']);
        cornerstoneTools.addToolState(element, 'stack', stack);
      });

      handleResetViewport();
    }
  };

  const handleSaveImage = () => {
    const element = document.getElementById('viewer_' + currentViewerId);
    const canvas = cornerstone.getEnabledElement(element).canvas;
    const dataUrl = canvas.toDataURL('image/png');

    // Create a link to download the data URL as an image
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'image.png';
    link.click();
  };

  const handleRemoveAnnotation = () => {
    const element = document.getElementById('viewer_' + currentViewerId);

    // Get the names of all tools
    const toolNames = cornerstoneTools.store.state.tools.map(
      (tool: { name: string }) => tool.name
    );

    // Clear the tool state for each tool
    toolNames.forEach((toolName: string) => {
      cornerstoneTools.clearToolState(element, toolName);
    });

    // Redraw the image to reflect the changes
    cornerstone.updateImage(element);
  };

  const handleResetViewport = () => {
    const element = document.getElementById('viewer_' + currentViewerId);
    cornerstone.reset(element);
  };

  return (
    <div className="sticky left-0 top-0 w-full">
      <input
        ref={inputRef}
        id="fileInput"
        type="file"
        multiple
        onChange={handleFileChange}
        accept=".dcm"
        style={{ position: 'absolute', marginLeft: '-9999px' }}
      />
      <div className="flex w-full flex-wrap items-center justify-center rounded-md bg-background px-4 py-2 shadow-lg dark:shadow-white/10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                onClick={() => inputRef.current?.click()}
                size="xs"
                variant="ghost"
              >
                <p className="sr-only">Upload</p>
                <Upload className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Upload</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Button size="xs" variant="ghost" onClick={handleSaveImage}>
                <p className="sr-only">Save Image</p>
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Save Image</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-2 h-5" />

          <div className="5 flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => {
                    setMouseWheelTool('StackScroll');
                    cornerstoneTools.setToolActive('StackScrollMouseWheel', {});
                  }}
                  className={cn(
                    mouseWheelTool === 'StackScroll' && 'bg-accent'
                  )}
                  variant="ghost"
                  size="xs"
                >
                  <p className="sr-only">Mouse Wheel Stack Scroll</p>
                  <GalleryVerticalEnd className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Mouse Wheel Stack Scroll
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={() => {
                    setMouseWheelTool('Zoom');
                    cornerstoneTools.setToolActive('ZoomMouseWheel', {});
                  }}
                  className={cn(mouseWheelTool === 'Zoom' && 'bg-accent')}
                  variant="ghost"
                  size="xs"
                >
                  <p className="sr-only">Mouse Wheel Zoom</p>
                  <SearchCode className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Mouse Wheel Zoom</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="mx-2 h-5" />

          {tools.map((toolGroup, i) => (
            <div key={i} className="flex items-center gap-0.5">
              {toolGroup.map((tool) => (
                <Tooltip key={tool.name}>
                  <TooltipTrigger>
                    <Button
                      className={cn(activeTool === tool.tool && 'bg-accent')}
                      size="xs"
                      variant="ghost"
                      onClick={() => {
                        setActiveTool(tool.tool);
                        cornerstoneTools.setToolActive(tool.tool, {
                          mouseButtonMask: 1,
                        });
                      }}
                    >
                      <p className="sr-only">{tool.name}</p>
                      <tool.icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{tool.name}</TooltipContent>
                </Tooltip>
              ))}
              {i !== tools.length - 1 && (
                <Separator orientation="vertical" className="mx-2 h-5" />
              )}
              {i === tools.length - 1 && (
                <>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={handleRemoveAnnotation}
                      >
                        <p className="sr-only">Remove Annotations</p>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Remove Annotations
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={handleResetViewport}
                      >
                        <p className="sr-only">Reset</p>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Remove Annotations
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          ))}

          <Separator orientation="vertical" className="mx-2 h-5" />

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">Layout</TooltipContent>
            </Tooltip>
            <DropdownMenuContent
              className="grid grid-cols-4 grid-rows-2"
              align="end"
            >
              <DropdownMenuItem
                onClick={() => {
                  setCurrentViewerId(0);
                  setFirstViewportsCount(1);
                  setSecondViewportsCount(0);
                }}
              >
                <SquareIcon className="h-5 w-5" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setCurrentViewerId(0);
                  setFirstViewportsCount(1);
                  setSecondViewportsCount(1);
                }}
              >
                <Columns2 className="h-5 w-5" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setCurrentViewerId(0);
                  setFirstViewportsCount(2);
                  setSecondViewportsCount(0);
                }}
              >
                <Rows2 className="h-5 w-5" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setCurrentViewerId(0);
                  setFirstViewportsCount(2);
                  setSecondViewportsCount(2);
                }}
              >
                <Grid2X2 className="h-5 w-5" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setCurrentViewerId(0);
                  setFirstViewportsCount(1);
                  setSecondViewportsCount(2);
                  setSplitViewportsBy('cols');
                }}
              >
                <LayoutPanelLeft className="h-5 w-5" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setCurrentViewerId(0);
                  setFirstViewportsCount(2);
                  setSecondViewportsCount(1);
                  setSplitViewportsBy('cols');
                }}
              >
                <LayoutPanelLeft className="h-5 w-5 rotate-180" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setCurrentViewerId(0);
                  setFirstViewportsCount(1);
                  setSecondViewportsCount(2);
                  setSplitViewportsBy('rows');
                }}
              >
                <LayoutPanelTop className="h-5 w-5" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setCurrentViewerId(0);
                  setFirstViewportsCount(2);
                  setSecondViewportsCount(1);
                  setSplitViewportsBy('rows');
                }}
              >
                <LayoutPanelTop className="h-5 w-5 rotate-180" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      </div>
    </div>
  );
}
