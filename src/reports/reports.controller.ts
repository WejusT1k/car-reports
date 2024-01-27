import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dto/createReportDto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/authGuard.guard';
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: CreateReportDto) {
    return this.reportsService.create(body);
  }
}
