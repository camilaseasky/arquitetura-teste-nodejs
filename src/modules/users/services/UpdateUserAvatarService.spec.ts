import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;

let fakeStorageProvider: FakeStorageProvider;

let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('Should be able to update a user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Camila Barbosa',
      email: 'camila@gmail.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'camilabarbosa.jpg',
    });

    expect(user.avatar).toBe('camilabarbosa.jpg');
  });

  it('Should not be able to update avatar when non existing user', async () => {
    await expect(
      updateUserAvatarService.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'camilabarbosa.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should to delete old avatar when updating new one', async () => {
    // vai acompanhar se o metodo foi executado
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'Camila Barbosa',
      email: 'camila@gmail.com',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'camilabarbosa.jpg',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'camilabarbosa2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('camilabarbosa.jpg');

    expect(user.avatar).toBe('camilabarbosa2.jpg');
  });
});
