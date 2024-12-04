import Dexie, { EntityTable } from 'dexie';
import CompressionManager from './CompressionManager';

export interface Study {
  id: string;
  seriesCount: number;
  instancesCount: number;
  cachedInstancesCount: number;
  originalSize: number;
  compressedSize: number;
  cachedAt: Date;
}

export interface Series {
  id: string;
  studyId: string;
  instancesCount: number;
  cachedInstancesCount: number;
  originalSize: number;
  compressedSize: number;
  previewImage: File | null;
}

export interface Instance {
  id: string;
  seriesId: string;
  studyId: string;
  file: File;
  originalSize: number;
  compressedSize: number;
  isCompressed: boolean;
}

export interface SeriesInfo {
  seriesId: string;
  instances: string[];
}

export interface StudyData {
  studyId: string;
  series: SeriesInfo[];
}

// Create the database instance and extend it with custom tables
export const db = new Dexie('VitaDICOMCacheDB') as Dexie & {
  study: EntityTable<Study, 'id'>;
  series: EntityTable<Series, 'id'>;
  instance: EntityTable<Instance, 'id'>;
};

// Define the schema
db.version(1).stores({
  study:
    'id, seriesCount, instancesCount, cachedInstancesCount, originalSize, compressedSize, cachedAt',
  series:
    'id, studyId, instancesCount, cachedInstancesCount, originalSize, compressedSize, previewImage',
  instance:
    'id, seriesId, studyId, file, originalSize, compressedSize, isCompressed',
});

class DbManager {
  /**
   * Handles an instance upload by checking if the instance already exists,
   * and if not, updates the counts and saves the new instance.
   *
   * @param studyId - The ID of the study.
   * @param seriesId - The ID of the series.
   * @param instanceId - The ID of the instance.
   * @param instanceFile - The File object representing the instance.
   * @returns The file if it already exists; otherwise, returns null.
   */
  static async handleInstanceUpload(
    studyId: string,
    seriesId: string,
    instanceId: string,
    instanceFile: File,
    enableCompression: boolean
  ): Promise<File> {
    try {
      // Check if the instance already exists
      const existingInstance = await db.instance.get(instanceId);

      if (existingInstance) {
        // Instance exists, return the file
        if (!existingInstance.isCompressed) {
          return existingInstance.file;
        }

        // Decompress the file and return the original instance file
        const { file: existingInstanceFile } =
          await CompressionManager.decompressFile(existingInstance.file);
        return existingInstanceFile;
      }

      let finalFile = instanceFile;
      let originalSize = 0;
      let compressedSize = 0;

      if (!enableCompression) {
        const arrayBuffer = await instanceFile.arrayBuffer();
        originalSize = arrayBuffer.byteLength;
        compressedSize = originalSize;
      }

      if (enableCompression) {
        const {
          file: compressedFile,
          originalSize: outputOriginalSize,
          compressedSize: outputCompressedSize,
        } = await CompressionManager.compressFile(instanceFile);

        finalFile = compressedFile;
        originalSize = outputOriginalSize;
        compressedSize = outputCompressedSize;
      }

      // Perform the database operations in a transaction
      await db.transaction('rw', db.study, db.series, db.instance, async () => {
        // Get the current counts for study and series
        const study = await db.study.get(studyId);
        const series = await db.series.get(seriesId);

        if (!study || !series) {
          throw new Error('Study or series not found');
        }

        // Increment cachedInstancesCount in study
        await db.study.update(studyId, {
          cachedInstancesCount: (study.cachedInstancesCount || 0) + 1,
          originalSize: (study.originalSize || 0) + originalSize,
          compressedSize: (study.compressedSize || 0) + compressedSize,
        });

        // Increment cachedInstancesCount in series
        await db.series.update(seriesId, {
          cachedInstancesCount: (series.cachedInstancesCount || 0) + 1,
          originalSize: (series.originalSize || 0) + originalSize,
          compressedSize: (series.compressedSize || 0) + compressedSize,
        });

        // Save the new instance
        await db.instance.add({
          id: instanceId,
          seriesId: seriesId,
          studyId: studyId,
          file: finalFile,
          originalSize,
          compressedSize,
          isCompressed: enableCompression,
        });
      });

      // Return the original instance file, since it was successfully added
      return instanceFile;
    } catch (error) {
      console.error('Error handling instance upload:', error);
      throw error; // Re-throw the error to handle it in the calling code
    }
  }

  /**
   * Checks if a study exists and ensures its series are correctly stored.
   * Creates a new study if it does not exist, and updates series metadata.
   *
   * @param studyData - The study data containing studyId and series information.
   * @returns A promise that resolves when the operation is complete.
   */
  static async checkAndStoreStudy(
    studyData: StudyData
  ): Promise<Study | undefined> {
    const { studyId, series } = studyData;

    try {
      // Check if the study exists
      const existingStudy = await db.study.get(studyId);

      if (!existingStudy) {
        // Create a new study entry if it doesn't exist
        await db.study.add({
          id: studyId,
          seriesCount: series.length,
          instancesCount: series.reduce(
            (total, s) => total + s.instances.length,
            0
          ),
          cachedInstancesCount: 0,
          originalSize: 0,
          compressedSize: 0,
          cachedAt: new Date(),
        });
      } else {
        // Update existing study entry with new metadata
        await db.study.update(studyId, {
          seriesCount: series.length,
          instancesCount: series.reduce(
            (total, s) => total + s.instances.length,
            0
          ),
        });
      }

      // Process series
      await db.transaction('rw', db.series, async () => {
        for (const s of series) {
          // Check if the series exists
          const existingSeries = await db.series.get(s.seriesId);

          if (!existingSeries) {
            // Create a new series entry if it doesn't exist
            await db.series.add({
              id: s.seriesId,
              studyId: studyId,
              instancesCount: s.instances.length,
              cachedInstancesCount: 0,
              originalSize: 0,
              compressedSize: 0,
              previewImage: null,
            });
          } else {
            // Update existing series entry with new metadata
            await db.series.update(s.seriesId, {
              instancesCount: s.instances.length,
            });
          }
        }
      });

      return await db.study.get(studyId);
    } catch (error) {
      console.error('Error checking and storing study:', error);
      throw error; // Re-throw the error to handle it in the calling code
    }
  }

  /**
   * Updates the preview image for a series from the database.
   *
   * @param seriesId - The ID of the series.
   * @param previewImage - The new preview image file.
   * @returns The preview image file if found; otherwise, returns null.
   */
  static async handleUpdateSeriesPreviewImage(
    seriesId: string,
    previewImage: File
  ): Promise<void> {
    try {
      await db.series.update(seriesId, { previewImage });
    } catch (error) {
      console.error('Error updating series preview image:', error);
      throw error;
    }
  }
}

export default DbManager;
