import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { CardValidatorResponse } from './models/card-validator.response.model';
import * as FormData from 'form-data';

@Injectable()
export class CardValidatorService {
  constructor(private readonly httpService: HttpService) {}

  private runValidator(
    filename: string,
  ): Promise<AxiosResponse<CardValidatorResponse>> {
    const form = new FormData();
    form.append('filename', filename);
    return this.httpService
      .post('http://127.0.0.1:5000/check', form, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`,
        },
      })
      .toPromise();
  }

  async validateCard(filename: string): Promise<boolean> {
    const res = await this.runValidator(filename);
    return res.data.exists;
  }
}
