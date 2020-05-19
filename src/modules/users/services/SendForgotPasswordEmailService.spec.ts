import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmail from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmail;

describe('SendForgotPasswordEmail', () => {
  // esta função será executada antes de cada teste
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmail(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('Should be able to recovery password with the email', async () => {
    const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Camila Barbosa',
      email: 'camila@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'camila@gmail.com',
    });

    expect(sendEmail).toHaveBeenCalled();
  });

  it('Should not be able to recovery a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'camila@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Camila Barbosa',
      email: 'camila@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'camila@gmail.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
