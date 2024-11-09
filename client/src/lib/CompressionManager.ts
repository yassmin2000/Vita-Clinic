// @ts-ignore
import pako from 'pako';

class CompressionManager {
  /**
   * Compresses a given file using pako (DEFLATE) compression.
   * @param file - The file to compress.
   * @returns A Promise resolving to the compressed file.
   */
  static async compressFile(
    file: File
  ): Promise<{ file: File; originalSize: number; compressedSize: number }> {
    const arrayBuffer = await file.arrayBuffer();
    const compressedArrayBuffer = pako.deflate(new Uint8Array(arrayBuffer));

    // Calculate the size difference
    const originalSize = arrayBuffer.byteLength;
    const compressedSize = compressedArrayBuffer.byteLength;
    const sizeDifference = originalSize - compressedSize;
    const sizeDifferencePercentage = (
      (sizeDifference / originalSize) *
      100
    ).toFixed(2);

    // Convert the compressed ArrayBuffer back to a Blob
    const compressedBlob = new Blob([compressedArrayBuffer], {
      type: 'application/octet-stream',
    });
    const compressedFile = new File([compressedBlob], file.name, {
      type: file.type,
    });

    return {
      file: compressedFile,
      originalSize: Number((originalSize / 1024).toFixed(2)),
      compressedSize: Number((compressedSize / 1024).toFixed(2)),
    };
  }

  /**
   * Decompresses a given file that was compressed using pako (DEFLATE) compression.
   * @param file - The file to decompress.
   * @returns A Promise resolving to the decompressed file.
   */
  static async decompressFile(
    file: File
  ): Promise<{ file: File; originalSize: number; compressedSize: number }> {
    {
      const compressedArrayBuffer = await file.arrayBuffer();
      const decompressedArrayBuffer = pako.inflate(
        new Uint8Array(compressedArrayBuffer)
      );

      // Calculate the size difference
      const compressedSize = compressedArrayBuffer.byteLength;
      const decompressedSize = decompressedArrayBuffer.byteLength;
      const sizeDifference = decompressedSize - compressedSize;
      const sizeDifferencePercentage = (
        (sizeDifference / decompressedSize) *
        100
      ).toFixed(2);

      // Convert the decompressed ArrayBuffer back to a Blob
      const decompressedBlob = new Blob([decompressedArrayBuffer], {
        type: 'application/octet-stream',
      });
      const decompressedFile = new File([decompressedBlob], file.name, {
        type: file.type,
      });

      return {
        file: decompressedFile,
        originalSize: Number((decompressedSize / 1024).toFixed(2)),
        compressedSize: Number((compressedSize / 1024).toFixed(2)),
      };
    }
  }
}

export default CompressionManager;
