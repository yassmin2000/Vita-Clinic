import axios from 'axios';
import * as dcmjs from 'dcmjs';

interface DicomInstance {
  instanceNumber: number;
  instanceUID: string;
  url: string;
}

interface DicomSeries {
  seriesInstanceUID: string;
  seriesNumber: number;
  description?: string;
  modality?: string;
  laterality?: 'r' | 'l';
  view?: 'cc' | 'mlo';
  instances: DicomInstance[];
}

interface DicomStudy {
  studyInstanceUID: string;
  description?: string;
  series: Map<string, DicomSeries>;
}

type DicomStudyArray = Omit<DicomStudy, 'series'> & {
  series: DicomSeries[];
};

export async function processDicomFiles(
  files: string[],
): Promise<DicomStudyArray[]> {
  const studies = new Map<string, DicomStudy>();

  for (const file of files) {
    try {
      const dicomBuffer = await loadDicomFile(file);

      // Use dcmjs to extract metadata
      const dicomData = dcmjs.data.DicomMessage.readFile(dicomBuffer);

      const studyDescription: string | undefined =
        dicomData.dict['00081030']?.Value[0]; // Study Description
      const studyInstanceUID: string | undefined =
        dicomData.dict['0020000D']?.Value[0]; // Study Instance UID
      const seriesInstanceUID: string | undefined =
        dicomData.dict['0020000E']?.Value[0]; // Series Instance UID
      const seriesNumber = parseInt(dicomData.dict['00200011']?.Value[0]); // Series Number

      const instanceUID: string | undefined =
        dicomData.dict['00080018']?.Value[0]; // SOP Instance UID
      const instanceNumber = parseInt(dicomData.dict['00200013']?.Value[0]); // Instance Number
      const seriesDescription: string | undefined =
        dicomData.dict['0008103E']?.Value[0]; // Series Description

      const modality: string | undefined = dicomData.dict['00080060']?.Value[0]; // Modality

      if (!studyInstanceUID || !seriesInstanceUID || !instanceUID) {
        console.warn(`Missing required DICOM tags in file: ${file}`);
        continue;
      }

      if (!studies.has(studyInstanceUID)) {
        studies.set(studyInstanceUID, {
          studyInstanceUID,
          description: studyDescription,
          series: new Map<string, DicomSeries>(),
        });
      }

      const study = studies.get(studyInstanceUID)!;

      if (!study.series.has(seriesInstanceUID)) {
        const laterality = getMammogramLaterality(dicomData, seriesDescription);
        const view = getMammogramView(dicomData, seriesDescription);

        study.series.set(seriesInstanceUID, {
          seriesInstanceUID,
          seriesNumber,
          description: seriesDescription,
          modality,
          laterality,
          view,
          instances: [],
        });
      }

      const series = study.series.get(seriesInstanceUID)!;
      series.instances.push({ instanceNumber, instanceUID, url: file });
    } catch (error) {
      console.error(`Error processing file ${file}: ${error.message}`);
    }
  }

  for (const study of studies.values()) {
    // Sort series by Series Number
    study.series = new Map(
      Array.from(study.series.values())
        .sort((a, b) => a.seriesNumber - b.seriesNumber)
        .map((series) => [series.seriesInstanceUID, series]),
    );

    // Sort instances within each series by Instance Number
    for (const series of study.series.values()) {
      series.instances.sort((a, b) => a.instanceNumber - b.instanceNumber);
    }
  }

  // Convert series map to array for easier consumption
  const result = Array.from(studies.values()).map((study) => ({
    studyInstanceUID: study.studyInstanceUID,
    description: study.description,
    series: Array.from(study.series.values()).map((series) => ({
      seriesInstanceUID: series.seriesInstanceUID,
      seriesNumber: series.seriesNumber,
      description: series.description,
      modality: series.modality,
      laterality: series.laterality,
      view: series.view,
      instances: series.instances,
    })),
  }));

  return result;
}

async function loadDicomFile(file: string): Promise<ArrayBuffer> {
  if (file.startsWith('http')) {
    const buffer = await downloadFromUrl(file);
    return bufferToArrayBuffer(buffer);
  } else {
    throw new Error('File is not a valid URL');
  }
}

function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  );
}

async function downloadFromUrl(fileUrl: string): Promise<Buffer> {
  try {
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  } catch (error) {
    throw new Error(`Failed to download file from URL: ${fileUrl}`);
  }
}

function getMammogramLaterality(
  dicomData: any,
  seriesDescription: string | undefined,
): 'r' | 'l' | undefined {
  const laterality: string | undefined = dicomData.dict['00200062']?.Value[0];
  if (laterality && laterality !== 'undefined')
    return laterality.toLowerCase() === 'r'
      ? 'r'
      : laterality.toLowerCase() === 'l'
        ? 'l'
        : undefined;

  if (seriesDescription) {
    const lowerDescription = seriesDescription.toLowerCase();
    if (
      lowerDescription.includes(' r ') ||
      lowerDescription.includes('right') ||
      lowerDescription.includes('_r') ||
      lowerDescription.includes('-r') ||
      lowerDescription.includes('r_') ||
      lowerDescription.includes('r-') ||
      lowerDescription.includes('r.') ||
      lowerDescription.includes('.r') ||
      lowerDescription.startsWith('r ') ||
      lowerDescription.endsWith(' r')
    )
      return 'r';
    if (
      lowerDescription.includes(' l ') ||
      lowerDescription.includes('left') ||
      lowerDescription.includes('_l') ||
      lowerDescription.includes('-l') ||
      lowerDescription.includes('l_') ||
      lowerDescription.includes('l-') ||
      lowerDescription.includes('l.') ||
      lowerDescription.includes('.l') ||
      lowerDescription.startsWith('l ') ||
      lowerDescription.endsWith(' l')
    )
      return 'l';
  }
  return undefined;
}

function getMammogramView(
  dicomData: any,
  seriesDescription: string | undefined,
): 'cc' | 'mlo' | undefined {
  const view: string | undefined = dicomData.dict['00185101']?.Value[0]; // View
  if (view && view !== 'undefined')
    return view.toLocaleLowerCase() === 'cc'
      ? 'cc'
      : view.toLocaleLowerCase() === 'mlo'
        ? 'mlo'
        : undefined;

  if (seriesDescription) {
    const lowerDescription = seriesDescription.toLowerCase();
    if (lowerDescription.includes('cc')) return 'cc';
    if (lowerDescription.includes('mlo')) return 'mlo';
  }
  return undefined;
}
