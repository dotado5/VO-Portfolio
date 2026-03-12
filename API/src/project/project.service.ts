import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private projectRepository: ProjectRepository) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    return this.projectRepository.create(createProjectDto);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.findAll();
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    await this.findOne(id); // Ensure it exists
    return this.projectRepository.update(id, updateProjectDto);
  }

  async remove(id: number): Promise<Project> {
    await this.findOne(id); // Ensure it exists
    return this.projectRepository.remove(id);
  }
}
