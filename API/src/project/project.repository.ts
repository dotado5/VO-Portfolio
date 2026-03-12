import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Project } from '@prisma/client';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProjectDto): Promise<Project> {
    return this.prisma.project.create({
      data: {
        ...data,
        delivery_date: new Date(data.delivery_date),
      },
    });
  }

  async findAll(): Promise<Project[]> {
    return this.prisma.project.findMany();
  }

  async findOne(id: number): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdateProjectDto): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        delivery_date: data.delivery_date
          ? new Date(data.delivery_date)
          : undefined,
      },
    });
  }

  async remove(id: number): Promise<Project> {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
