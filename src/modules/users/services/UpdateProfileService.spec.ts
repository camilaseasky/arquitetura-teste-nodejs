import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to update user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Camila Barbosa',
      email: 'camila@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Paula Marisa',
      email: 'paulam.seasky@gmail.com',
    });

    expect(updatedUser.name).toBe('Paula Marisa');
    expect(updatedUser.email).toBe('paulam.seasky@gmail.com');
  });

  it('Should not be able to update non-existing user profile', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'non-existing-user-id',
        name: 'Paula Marisa',
        email: 'paulam.seasky@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update email with a already used email', async () => {
    await fakeUsersRepository.create({
      name: 'Camila Barbosa',
      email: 'camila@gmail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Camila Miranda',
      email: 'camilam@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Camila Miranda',
        email: 'camila@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to update password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Camila Barbosa',
      email: 'camila@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Paula Marisa',
      email: 'paulam.seasky@gmail.com',
      password: '123123',
      old_password: '123456',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('Should not be able to update password without the old password information', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Camila Barbosa',
      email: 'camila@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Paula Marisa',
        email: 'paulam.seasky@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update password with a incorrect old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Camila Barbosa',
      email: 'camila@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Paula Marisa',
        email: 'paulam.seasky@gmail.com',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
