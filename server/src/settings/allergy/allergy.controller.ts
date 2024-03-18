import { Controller, Get } from '@nestjs/common';

@Controller('settings/allergy')
export class AllergyController {
  @Get()
  getAllergy() {
    return 'Allergy';
  }
}
