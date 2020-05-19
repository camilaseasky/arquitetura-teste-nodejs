import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProvidersService = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to list providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Camila Barbosa',
      email: 'camila@gmail.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Paula Fernandes',
      email: 'paula@gmail.com',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Bernardo Figueiredo',
      email: 'bernardo@gmail.com',
      password: '123456',
    });

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
