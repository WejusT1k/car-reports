import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/createReportDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>
  ) {}

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
