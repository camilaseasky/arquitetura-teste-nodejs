import { container } from 'tsyringe';

import '@modules/users/providers';

import IAppointmentRepository from '@modules/appointmens/repositories/IAppointmentsRepository';
import AppointmentRepository from '@modules/appointmens/infra/typeorm/repositories/appointmentsRepository';

import IUserRepository from '@modules/users/repositories/IUsersRepository';
import UserRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

container.registerSingleton<IAppointmentRepository>(
  'AppointmentRepository',
  AppointmentRepository,
);

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
