import ICreateAppointmentDTO from '@modules/appointmens/dtos/ICreateAppointmentDTO';
import Appointment from '@modules/appointmens/infra/typeorm/entities/appointments';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}
