import CompressionManager from './CompressionManager';
import DbManager, { db } from './DbManager';

class CacheManager {
  /**
   * Fetches an instance from the cache if available, otherwise retrieves it from the network,
   * and uploads the instance to the database if it is not already cached.
   *
   * @param studyId - The ID of the study associated with the instance.
   * @param seriesId - The ID of the series associated with the instance.
   * @param instanceId - The unique URL of the instance, used both as its ID and to fetch it if not cached.
   * @param instanceURL - The URL to fetch the instance from if it is not cached.
   * @returns The instance file (either from the cache or newly fetched from the network).
   */
  static async fetchAndStoreInstance(
    studyId: string,
    seriesId: string,
    instanceId: string,
    instanceURL: string
  ): Promise<File> {
    try {
      // Check if the instance already exists in the database
      const existingInstance = await db.instance.get(instanceId);

      if (existingInstance) {
        // Instance exists in the database, decompress and return it
        const { file } = await CompressionManager.decompressFile(
          existingInstance.file
        );
        return file;
      } else {
        // Instance not in the database, fetch it from the network
        const response = await fetch(instanceURL);

        // Convert the fetched response to a Blob
        const blob = await response.blob();

        // Create a File object from the Blob, naming it using the instanceId
        const file = new File([blob], instanceId, { type: blob.type });

        // Cache the new instance by uploading it to the database
        await DbManager.handleInstanceUpload(
          studyId,
          seriesId,
          instanceId,
          file
        );

        // Return the newly fetched instance file
        return file;
      }
    } catch (error) {
      console.error('Error fetching and storing instance:', error);
      throw error; // Re-throw the error to handle it in the calling code
    }
  }

  /**
   * Fetches a preview series image from the cache if available, otherwise retrieves it from the network,
   * and uploads the image to the database if it is not already cached.
   *
   * @param seriesId - The ID of the series associated with the preview image.
   * @param url - The URL to fetch the preview image from if it is not cached.
   * @returns The preview image file (either from the cache or newly fetched from the network).
   */
  static async fetchAndStorePreviewSeriesImage(seriesId: string, url: string) {
    try {
      const series = await db.series.get(seriesId);

      if (!series) {
        throw new Error('Series not found in database');
      }

      if (series.previewImage) {
        return series.previewImage;
      }

      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], seriesId, { type: blob.type });

      await DbManager.handleUpdateSeriesPreviewImage(seriesId, file);

      return file;
    } catch (error) {
      console.error('Error fetching and storing preview series image:', error);
      throw error;
    }
  }

  /**
   * Fetches cached study information by studyId.
   *
   * @param studyId - The ID of the study to retrieve information for.
   * @returns A promise that resolves to an object containing cached instances count, original size, and compressed size.
   */
  static async getCachedStudyInfo(studyId: string): Promise<{
    studyId: string;
    cachedInstances: number;
    originalSize: number;
    compressedSize: number;
  } | null> {
    try {
      const study = await db.study.get(studyId);
      if (study) {
        return {
          studyId: study.id,
          cachedInstances: study.cachedInstancesCount,
          originalSize: study.originalSize,
          compressedSize: study.compressedSize,
        };
      }
      return null; // Study not found
    } catch (error) {
      console.error('Error fetching cached study info:', error);
      throw error;
    }
  }

  /**
   * Fetches cached series information by seriesId.
   *
   * @param seriesId - The ID of the series to retrieve information for.
   * @returns A promise that resolves to an object containing cached instances count, original size, and compressed size.
   */
  static async getCachedSeriesInfo(seriesId: string): Promise<{
    seriesId: string;
    cachedInstances: number;
    originalSize: number;
    compressedSize: number;
  } | null> {
    try {
      const series = await db.series.get(seriesId);
      if (series) {
        return {
          seriesId: series.id,
          cachedInstances: series.cachedInstancesCount,
          originalSize: series.originalSize,
          compressedSize: series.compressedSize,
        };
      }
      return null; // Series not found
    } catch (error) {
      console.error('Error fetching cached series info:', error);
      throw error;
    }
  }

  /**
   * Fetches metadata for a study and all its associated series.
   *
   * @param studyId - The ID of the study to retrieve metadata for.
   * @returns A promise that resolves to an object containing study metadata and its associated series array.
   */
  static async getStudyAndSeriesMetadata(studyId: string): Promise<{
    studyId: string;
    cachedInstances: number;
    originalSize: number;
    compressedSize: number;
    series: {
      seriesId: string;
      cachedInstances: number;
      originalSize: number;
      compressedSize: number;
    }[];
  } | null> {
    try {
      const study = await db.study.get(studyId);
      if (!study) {
        return null; // Study not found
      }

      // Fetch all series associated with this study
      const series = await db.series.where('studyId').equals(studyId).toArray();

      // Map the series data into a structured format
      const seriesData = series.map((s) => ({
        seriesId: s.id,
        cachedInstances: s.cachedInstancesCount,
        originalSize: s.originalSize,
        compressedSize: s.compressedSize,
      }));

      return {
        studyId: study.id,
        cachedInstances: study.cachedInstancesCount,
        originalSize: study.originalSize,
        compressedSize: study.compressedSize,
        series: seriesData,
      };
    } catch (error) {
      console.error('Error fetching study and series metadata:', error);
      throw error;
    }
  }
}

export default CacheManager;
