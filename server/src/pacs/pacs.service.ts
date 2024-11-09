import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PacsService {
  constructor(private readonly httpService: HttpService) {}

  async getPreviewImage(
    fileURL: string,
    extension: string,
  ): Promise<AxiosResponse<any>> {
    const fastApiUrl = process.env.FASTAPI_URL;
    let decodedFileURL = decodeURIComponent(fileURL);
    decodedFileURL = decodedFileURL.replace(/&/g, '%26');

    const url = `${process.env.FASTAPI_URL}/dicom/preview?fileURL=${decodedFileURL}&extension=${extension}`;
    const headers = { 'X-API-KEY': process.env.FASTAPI_API_KEY };

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers, responseType: 'arraybuffer' }),
      );
      return response;
    } catch (error) {
      throw new Error(`Error fetching preview image: ${error.message}`);
    }
  }
}
