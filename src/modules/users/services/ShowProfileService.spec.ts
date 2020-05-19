import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;

let showProfileService: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('Should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Camila Barbosa',
      email: 'camila@gmail.com',
      password: '123456',
    });

    const profileUser = await showProfileService.execute(user.id);

    expect(profileUser.name).toBe('Camila Barbosa');
    expect(profileUser.email).toBe('camila@gmail.com');
  });

  it('Should not be able to show the profile from non-existing user', async () => {
    await expect(
      showProfileService.execute('non-existing-user-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
