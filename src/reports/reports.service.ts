import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/createReportDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>
  ) {}

  createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return this.reportRepository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }

  create(incomingDto: CreateReportDto, user: User) {
    const report = this.reportRepository.create({
      ...incomingDto,
      user: user
    });

    return this.reportRepository.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.reportRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['user']
    });
    console.log(report);

    if (!report) {
      throw new NotFoundException('report was not found');
    }

    report.approved = approved;

    return this.reportRepository.save(report);
  }
}
