import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentsService from './CreateAppointmentService';

let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeAppointmentRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentsService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeAppointmentRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentsService(
      fakeAppointmentRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: '123123123',
      user_id: '222222',
    });

    expect(appointment).toHaveProperty('id');
  });

  it('Should not be able to create two appointments in the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointmentDate = new Date(2020, 4, 10, 13);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123123',
      user_id: '222222',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '123123123',
        user_id: '2222222',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new appointment in the past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        provider_id: '123123123',
        user_id: '2222222',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new appointment to the same provider and user', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        provider_id: '123123123',
        user_id: '123123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new appointment before 8 am', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 7),
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create a new appointment after 17 pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 18),
        provider_id: 'provider-id',
        user_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
