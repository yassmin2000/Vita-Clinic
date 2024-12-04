'use client';

import { useRef, useState } from 'react';
// @ts-ignore
import cornerstone from 'cornerstone-core';
// @ts-ignore
import cornerstoneTools from 'cornerstone-tools';
// @ts-ignore
import {
  AArrowUp,
  Contrast,
  Eraser,
  Move,
  RotateCcw,
  RotateCw,
  Save,
  Search,
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
import { handleResetViewport } from '@/app/(pacs)/viewer/[scanId]/_components/ViewerToolbar';

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

  // Annotation Tools
  [
    {
      name: 'Arrow Annotate',
      tool: 'ArrowAnnotate',
      icon: AArrowUp,
    },
  ],
  [{ name: 'Eraser', tool: 'Eraser', icon: Eraser }],
];

export default function MiniViewerToolbar() {
  const [activeTool, setActiveTool] = useState<string>('Pan');

  const handleSaveImage = () => {
    const element = document.getElementById('mini_viewer');
    const canvas = cornerstone.getEnabledElement(element).canvas;
    const dataUrl = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'image.png';
    link.click();
  };

  return (
    <div className="w-full rounded-t-md border">
      <div className="flex w-full flex-wrap items-center justify-center rounded-md bg-background px-4 py-2 shadow-lg dark:shadow-white/10">
        <TooltipProvider>
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
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => handleResetViewport('mini_viewer')}
                    >
                      <p className="sr-only">Reset</p>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Reset</TooltipContent>
                </Tooltip>
              )}
            </div>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
