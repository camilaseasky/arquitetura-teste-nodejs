export default interface IHashProvider {
  generateHash(payload: string): Promise<string>;
  compareHash(payload: string, rashed: string): Promise<boolean>;
}
