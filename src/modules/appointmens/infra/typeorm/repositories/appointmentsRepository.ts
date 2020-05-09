import { getRepository, Repository } from 'typeorm';

import ICreateAppointmentDTO from '@modules/appointmens/dtos/ICreateAppointmentDTO';
import IAppointmentRepository from '@modules/appointmens/repositories/IAppointmentsRepository';
import Appointment from '@modules/appointmens/infra/typeorm/entities/appointments';

class AppointmentsRepository implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });
    return findAppointment;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, date });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
