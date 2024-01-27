import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/createReportDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>
  ) {}

  create(incommingDto: CreateReportDto) {
    const report = this.reportRepository.create(incommingDto);

    return this.reportRepository.save(report);
  }
}
