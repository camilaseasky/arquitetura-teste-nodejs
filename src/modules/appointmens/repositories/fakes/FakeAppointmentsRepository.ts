import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';
import ICreateAppointmentDTO from '@modules/appointmens/dtos/ICreateAppointmentDTO';
import IAppointmentRepository from '@modules/appointmens/repositories/IAppointmentsRepository';
import Appointment from '@modules/appointmens/infra/typeorm/entities/appointments';

class AppointmentsRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointmentSameDate = this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );

    return appointmentSameDate;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    // atribui os valores as propriedades do objeto
    Object.assign(appointment, { id: uuid(), date, provider_id });

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
