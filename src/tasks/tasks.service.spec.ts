import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { createQueryBuilder, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockUser = {
  username: 'mUser',
  id: 'someId',
  password: 'somePassword',
  tasks: [],
};

const tasks: Task[] = [];

const mockTasksRepository = () => ({
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis().mockResolvedValue(tasks),
  })),
  create: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

const TASK_REPOSITORY_TOKEN = getRepositoryToken(Task);

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    // initialize a NestJS module with tasksSerbice and tasksRepository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TASK_REPOSITORY_TOKEN, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get<Repository<Task>>(TASK_REPOSITORY_TOKEN);
  });

  it('Task service should be defined', () => {
    expect(tasksService).toBeDefined();
  });

  it('Task Repository should be defined', () => {
    expect(tasksRepository).toBeDefined();
  });

  describe('getTasks', () => {
    it('calls TasksService.getTasks and returns the result', async () => {
      const mockFilterDto = {};
      const result = await tasksService.getTasks(mockFilterDto, mockUser);
      expect(result.length).toEqual(0);
    });
  });

  describe('getTaskbyId', () => {
    it('calls TasksService.findOne and returns the result', async () => {
      const mockTask = {
        id: 'someId',
        title: 'Test Title',
        description: 'Only for testing',
        status: TaskStatus.OPEN,
      };

      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('someId', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksService.findOne and handles error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('someId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
