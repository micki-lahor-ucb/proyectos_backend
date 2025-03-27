import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: createTaskDto.projectId },
    });

    if (!project) {
      throw new NotFoundException(
        `Project with ID ${createTaskDto.projectId} not found`,
      );
    }

    if (project.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to add tasks to this project',
      );
    }

    const existingTask = await this.prisma.task.findFirst({
      where: {
        title: createTaskDto.title,
        projectId: createTaskDto.projectId,
      },
    });

    if (existingTask) {
      throw new BadRequestException(
        'A task with this title already exists in this project',
      );
    }

    if (createTaskDto.dueDate) {
      const dueDate = new Date(createTaskDto.dueDate);
      const today = new Date();

      if (dueDate < today) {
        throw new BadRequestException('Due date must be a future date');
      }
    }

    const { projectId, ...taskData } = createTaskDto;

    const formattedData = { ...taskData };
    if (formattedData.dueDate) {
      formattedData.dueDate = new Date(formattedData.dueDate).toISOString();
    }

    return this.prisma.task.create({
      data: {
        ...formattedData,
        user: {
          connect: {
            id: userId,
          },
        },
        project: {
          connect: {
            id: projectId,
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.task.findMany({
      where: {
        userId,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async findAllByProject(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view tasks for this project',
      );
    }

    return this.prisma.task.findMany({
      where: {
        projectId,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    if (task.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this task',
      );
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    await this.findOne(id, userId);

    if (updateTaskDto.projectId) {
      const project = await this.prisma.project.findUnique({
        where: { id: updateTaskDto.projectId },
      });

      if (!project) {
        throw new NotFoundException(
          `Project with ID ${updateTaskDto.projectId} not found`,
        );
      }

      if (project.userId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to move tasks to this project',
        );
      }
    }

    const { projectId, ...taskData } = updateTaskDto;

    const data: any = { ...taskData };

    if (projectId) {
      data.project = {
        connect: { id: projectId },
      };
    }

    const formattedData = { ...updateTaskDto };
    if (formattedData.dueDate) {
      formattedData.dueDate = new Date(formattedData.dueDate).toISOString();
    }

    return this.prisma.task.update({
      where: { id },
      data: formattedData,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
