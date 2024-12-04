'use client';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
// @ts-ignore
import cornerstone from 'cornerstone-core';
// @ts-ignore
import cornerstoneTools from 'cornerstone-tools';
// @ts-ignore
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import {
  AArrowUp,
  Bot,
  Brain,
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
  Menu,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';

import useViewerStore from '@/hooks/useViewerStore';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/Icons';
import { Study } from '@/types/appointments.type';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import useAccessToken from '@/hooks/useAccessToken';
import { useToast } from '@/components/ui/use-toast';

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

export const handleSetViewToRight = (viewerId: string) => {
  const element = document.getElementById(viewerId);
  const cornerstoneElement = cornerstone.getEnabledElement(element);
  const viewport = cornerstoneElement.viewport;
  const offsetLeft = cornerstoneElement.canvas.offsetLeft;
  const offsetRight = offsetLeft + cornerstoneElement.canvas.width;
  const position = cornerstone.pageToPixel(element, offsetRight, 0);
  const translationX =
    viewport.translation.x + position.x - cornerstoneElement.image.width;
  viewport.translation.x = translationX;
  viewport.translation.y = 0;
  cornerstone.setViewport(element, viewport);
};

export const handleSetViewToLeft = (viewerId: string) => {
  const element = document.getElementById(viewerId);
  const cornerstoneElement = cornerstone.getEnabledElement(element);
  const viewport = cornerstoneElement.viewport;
  const offsetLeft = cornerstoneElement.canvas.offsetLeft;
  const offsetRight = offsetLeft + cornerstoneElement.canvas.width;
  const position = cornerstone.pageToPixel(element, offsetRight, 0);
  const translationX =
    viewport.translation.x + position.x - cornerstoneElement.image.width;
  viewport.translation.x = -translationX;
  viewport.translation.y = 0;
  cornerstone.setViewport(element, viewport);
};

export const handleResetViewport = (viewerId: string) => {
  const element = document.getElementById(viewerId);
  cornerstone.reset(element);
};

function getCurrentImageIndex(viewerId: string) {
  const element = document.getElementById(viewerId);
  const toolState = cornerstoneTools.getToolState(element, 'stack');

  if (toolState && toolState.data && toolState.data.length > 0) {
    const stack = toolState.data[0];

    return stack.currentImageIdIndex;
  }

  return -1;
}

interface ViewerToolbarProps {
  study: Study;
}

export default function ViewerToolbar({ study }: ViewerToolbarProps) {
  const [activeTool, setActiveTool] = useState<string>('Pan');
  const [mouseWheelTool, setMouseWheelTool] = useState('StackScroll');
  const { currentViewerId, selectedSeries, setLayoutType } = useViewerStore();

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

      handleResetViewport(`viewer_${currentViewerId}`);
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

  const getCurrentInstance = () => {
    const index = getCurrentImageIndex(`viewer_${currentViewerId}`);
    const currentSeries = selectedSeries[currentViewerId];

    if (index && currentSeries) {
      const series = study.series.find(
        (s) => s.seriesInstanceUID === currentSeries
      );

      if (series) {
        return series.instances[index];
      }
    }

    return null;
  };

  const accessToken = useAccessToken();
  const { toast } = useToast();
  const { mutate: createPrediction, isPending } = useMutation({
    mutationFn: async (model: string) => {
      const instance = getCurrentInstance();

      if (!instance) {
        throw new Error('No instance found');
      }

      const body = {
        instanceId: instance.id,
        model,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/cdss`,
        body,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response;
    },
    onError: () => {
      return toast({
        title: 'Failed to make a prediction',
        description: 'An error occurred while making a prediction.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      return toast({
        title: 'Prediction task created',
        description:
          'A prediction task has been created successfully, you will be notified when the results are ready.',
      });
    },
  });

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
              <SidebarTrigger />
            </TooltipTrigger>
            <TooltipContent side="bottom">Series List</TooltipContent>
          </Tooltip>
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
                        onClick={() =>
                          handleResetViewport(`viewer_${currentViewerId}`)
                        }
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
                    <Bot className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">AI Predictions</TooltipContent>
            </Tooltip>
            <DropdownMenuContent className="flex flex-col" align="end">
              <DropdownMenuItem
                onClick={() => {
                  createPrediction('brain_mri');
                }}
              >
                <Brain className="mr-2 h-5 w-5" /> Brain MRI Tumors
                Classification
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  createPrediction('lung_ct');
                }}
              >
                <Icons.lungs className="mr-2 h-5 w-5" /> Lung CT Cancer
                Classification
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                <Icons.mammo className="mr-2 h-5 w-5" /> Mammography Breast
                Cancer Detection
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
                  setLayoutType('1_big');
                }}
              >
                <SquareIcon className="h-5 w-5" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setLayoutType('2_side_by_side');
                }}
              >
                <Columns2 className="h-5 w-5" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setLayoutType('2_top_to_bottom');
                }}
              >
                <Rows2 className="h-5 w-5" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setLayoutType('4_2x2');
                }}
              >
                <Grid2X2 className="h-5 w-5" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setLayoutType('1_big_2_small');
                }}
              >
                <LayoutPanelLeft className="h-5 w-5" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setLayoutType('2_small_1_big');
                }}
              >
                <LayoutPanelLeft className="h-5 w-5 rotate-180" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setLayoutType('1_big_top_2_small_bottom');
                }}
              >
                <LayoutPanelTop className="h-5 w-5" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setLayoutType('2_small_top_1_big_bottom');
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
