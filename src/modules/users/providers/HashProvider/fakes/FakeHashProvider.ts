import IHashProvider from '../models/IRashProvider';

class FakeHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  public async compareHash(paylod: string, hashed: string): Promise<boolean> {
    return paylod === hashed;
  }
}

export default FakeHashProvider;
