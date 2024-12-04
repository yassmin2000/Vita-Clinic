import dynamic from 'next/dynamic';

import Modal from '@/components/Modal';
import { Prediction, PredictionModel } from '@/types/cdss.type';
import { Skeleton } from '@/components/ui/skeleton';
import MiniViewerToolbar from './MiniViewerToolbar';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useAccessToken from '@/hooks/useAccessToken';
import { useToast } from '@/components/ui/use-toast';

const MiniDICOMViewer = dynamic(() => import('./MiniDICOMViewer'), {
  ssr: false,
});

interface PredictionModaProps {
  prediction?: Prediction;
  isLoading?: boolean;
}

interface PredictionType {
  model: PredictionModel;
  value: string;
  classes: {
    label: string;
    value: string;
    description: string;
  }[];
}

const predictions: PredictionType[] = [
  {
    // @ts-ignore
    model: 'brain_mri',
    value: 'Brain MRI Tumor Classification',
    classes: [
      {
        label: 'glioma',
        value: 'Glioma',
        description:
          'Glioma is a type of tumor that occurs in the brain and spinal cord.',
      },
      {
        label: 'meningioma',
        value: 'Meningioma',
        description:
          'Meningioma is a tumor that arises from the meninges — the membranes that surround your brain and spinal cord.',
      },
      {
        label: 'notumor',
        value: 'No Tumor',
        description: 'No tumor is detected in the scan.',
      },
      {
        label: 'pituitary',
        value: 'Pituitary',
        description: 'Pituitary is a tumor that occurs in the pituitary gland.',
      },
    ],
  },
  {
    // @ts-ignore
    model: 'lung_ct',
    value: 'Lung CT Cancer Classification',
    classes: [
      {
        label: 'adenocarcinoma_left.lower.lobe_T2_N0_M0_Ib',
        value: 'Adenocarcinoma',
        description: 'Adenocarcinoma is a type of non-small cell lung cancer.',
      },
      {
        label: 'large.cell.carcinoma_left.hilum_T2_N2_M0_IIIa',
        value: 'Large Cell Carcinoma',
        description:
          'Large cell carcinoma is a type of non-small cell lung cancer.',
      },
      {
        label: 'normal',
        value: 'Normal',
        description: 'No tumor is detected in the scan.',
      },
      {
        label: 'squamous.cell.carcinoma_left',
        value: 'Squamous Cell Carcinoma',
        description:
          'Squamous cell carcinoma is a type of non-small cell lung cancer.',
      },
    ],
  },
];

export default function PredictionModal({
  prediction,
  isLoading = false,
}: PredictionModaProps) {
  const [approval, setApproval] = useState<string | undefined>(
    prediction?.status === 'approved'
      ? 'yes'
      : prediction?.status === 'rejected'
        ? 'no'
        : undefined
  );
  const [comments, setComments] = useState(prediction?.comments || '');
  const accessToken = useAccessToken();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: approvePrediction, isPending: isApproving } = useMutation({
    mutationFn: async () => {
      if (!prediction) {
        throw new Error('Prediction not found');
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/cdss/${prediction.id}/approve`,
        {
          comments,
        },
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
        title: `Failed to approve prediction`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`prediction_${prediction?.id}`],
      });

      return toast({
        title: 'Prediction approved successfully',
      });
    },
  });

  const { mutate: rejectPrediction, isPending: isRejecting } = useMutation({
    mutationFn: async () => {
      if (!prediction) {
        throw new Error('Prediction not found');
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/cdss/${prediction.id}/reject`,
        {
          comments,
        },
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
        title: `Failed to reject prediction`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`prediction_${prediction?.id}`],
      });

      return toast({
        title: 'Prediction rejected successfully',
      });
    },
  });

  return (
    <Modal isOpen className="h-[90%] max-w-5xl">
      <div className="flex flex-col gap-6 md:flex-row">
        {!prediction || isLoading ? (
          <Skeleton className="h-[600px] w-full" />
        ) : (
          <div className="flex-1">
            <div className="flex flex-col gap-0">
              <MiniViewerToolbar />
              <div className="aspect-square w-full">
                <MiniDICOMViewer instance={prediction.instance} />
              </div>
            </div>
          </div>
        )}

        {!prediction || isLoading ? (
          <Skeleton className="h-[600px] w-full" />
        ) : (
          <div className="mr-2 flex-1">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-medium text-primary">
                  {prediction.instance.series.study.scan.title}
                </h3>
                <h4 className="text-base font-medium text-primary">
                  Series #{prediction.instance.series.seriesNumber} - Instance #
                  {prediction.instance.instanceNumber}
                </h4>
              </div>

              <div className="flex flex-col gap-1 font-medium text-foreground">
                <p>
                  AI Model:{' '}
                  {
                    predictions.find((pred) => pred.model === prediction.model)
                      ?.value
                  }
                </p>
                <p>
                  AI Prediction:{' '}
                  {
                    predictions
                      .find((pred) => pred.model === prediction.model)
                      ?.classes.find((cls) => cls.label === prediction.result)
                      ?.value
                  }
                </p>
                <p>
                  Prediction Probability:{' '}
                  {(prediction.probability * 100).toFixed(2)}%
                </p>
              </div>

              <Separator className="my-2" />

              <div className="flex flex-col gap-4 text-foreground">
                <div className="space-y-1">
                  <Label className="mb-1 font-semibold">
                    Do you approve this prediction?
                  </Label>
                  <RadioGroup
                    value={approval}
                    onValueChange={(value) => setApproval(value)}
                    disabled={
                      prediction.status !== 'predicted' ||
                      isApproving ||
                      isRejecting
                    }
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {approval && (
                  <div className="flex flex-col gap-1">
                    <Label
                      className="mb-1 font-semibold"
                      required={approval === 'no'}
                    >
                      {approval === 'yes' ? 'Comments' : 'Rejection Reason'}
                    </Label>
                    <Textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      minRows={4}
                      disabled={
                        prediction.status !== 'predicted' ||
                        isApproving ||
                        isRejecting
                      }
                      placeholder={
                        approval === 'yes'
                          ? 'Comments (Optional)'
                          : 'Rejection Reason'
                      }
                    />
                  </div>
                )}

                {prediction.status === 'predicted' && (
                  <div className="flex items-center justify-end">
                    <Button
                      onClick={() => {
                        if (approval === 'yes') {
                          approvePrediction();
                        } else if (approval === 'no') {
                          rejectPrediction();
                        }
                      }}
                      disabled={
                        !approval ||
                        (approval === 'no' && !comments) ||
                        isApproving ||
                        isRejecting
                      }
                    >
                      {approval === 'yes'
                        ? 'Approve'
                        : approval === 'no'
                          ? 'Reject'
                          : 'Submit'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
