import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeHashProvider: FakeHashProvider;

let createUserService: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('Should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'Camila Barbosa',
      email: 'camila@gmail.com',
      password: '123456',
    });

    await expect(user).toHaveProperty('id');
  });

  it('Should not be able to create a two users with the same email', async () => {
    await createUserService.execute({
      name: 'Ludmila Silva',
      email: 'camila@gmail.com',
      password: '123456',
    });

    await expect(
      createUserService.execute({
        name: 'Ludmila Silva',
        email: 'camila@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
