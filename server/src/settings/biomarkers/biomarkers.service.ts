import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateBiomarkerDto, UpdateBiomarkerDto } from './dto/biomarkers.dto'


@Injectable()
export class BiomarkersService {
    constructor(private readonly prisma: PrismaService) {}

    async createBiomarker(createBiomarkerDto: CreateBiomarkerDto) {
        return this.prisma.biomarker.create({
            data: createBiomarkerDto,
        });
    }

    async getAllBiomarkers() {
        return this.prisma.biomarker.findMany();
    }

    async getBiomarkerById(id: string) {
        return this.prisma.biomarker.findUnique({
            where: { id },
        });
    }


    async updateBiomarker(id: string, updateBiomarkerDto: UpdateBiomarkerDto) {
        const existingBiomarker = await this.prisma.biomarker.findUnique({
            where: { id },
        });

        if (!existingBiomarker) {
            return null;
        }

        return this.prisma.biomarker.update({
            where: { id },
            data: updateBiomarkerDto,
        });
    }

    async deleteBiomarker(id: string) {
        const existingBiomarker = await this.prisma.biomarker.findUnique({
            where: { id },
        });

        if (!existingBiomarker) {
            return null;
        }

        await this.prisma.biomarker.delete({
            where: { id },
        });

        return true;
    }
}
