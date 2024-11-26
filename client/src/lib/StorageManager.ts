import { db } from './DbManager';

class StorageManager {
  /**
   * Gets the total storage available on the user's device.
   * This uses the StorageManager API to estimate storage capacity.
   *
   * @returns A promise that resolves to the total storage capacity in bytes.
   */
  static async getTotalStorage(): Promise<number | undefined> {
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        return estimate.quota; // Total available storage in bytes
      } catch (error) {
        console.error('Error getting total storage:', error);
        return undefined;
      }
    } else {
      console.error('StorageManager API is not supported in this browser.');
      return undefined;
    }
  }

  /**
   * Gets the used storage on the user's device.
   * This uses the StorageManager API to estimate storage usage.
   *
   * @returns A promise that resolves to the used storage in bytes.
   */
  static async getUsedStorage(): Promise<number | undefined> {
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        return estimate.usage; // Used storage in bytes
      } catch (error) {
        console.error('Error getting used storage:', error);
        return undefined;
      }
    } else {
      console.error('StorageManager API is not supported in this browser.');
      return undefined;
    }
  }

  /**
   * Gets the remaining storage available on the user's device.
   * This calculates remaining storage by subtracting used storage from the total storage.
   *
   * @returns A promise that resolves to the remaining storage in bytes.
   */
  static async getRemainingStorage(): Promise<number | undefined> {
    try {
      const totalStorage = await this.getTotalStorage();
      const usedStorage = await this.getUsedStorage();

      if (totalStorage !== undefined && usedStorage !== undefined) {
        return totalStorage - usedStorage; // Remaining storage in bytes
      } else {
        return undefined;
      }
    } catch (error) {
      console.error('Error calculating remaining storage:', error);
      return undefined;
    }
  }

  /**
   * Clears the IndexedDB storage, effectively clearing all cached images
   * and data stored by the application.
   *
   * @returns A promise that resolves when the storage is successfully cleared.
   */
  static async clearStorage(): Promise<Boolean | undefined> {
    try {
      // Clear all tables in the database
      await db.transaction('rw', db.study, db.series, db.instance, async () => {
        await db.study.clear();
        await db.series.clear();
        await db.instance.clear();
      });

      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error; // Re-throw the error to handle it in the calling code
    }
  }
}

export default StorageManager;
