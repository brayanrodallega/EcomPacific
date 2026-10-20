import { User, UserRole } from './user.entity';
import { Sequelize } from 'sequelize-typescript';

describe('User serialization', () => {
  it('never includes the password hash in JSON output', async () => {
    const sequelize = new Sequelize({
      dialect: 'mysql',
      database: 'test',
      username: 'test',
      password: 'test',
      logging: false,
    });
    sequelize.addModels([User]);
    const user = User.build({
      id: 7,
      email: 'cliente@ejemplo.com',
      nombre: 'Cliente',
      password: 'bcrypt-hash',
      rol: UserRole.CLIENTE,
    });

    expect(user.toJSON()).not.toHaveProperty('password');
    expect(user.toJSON()).toMatchObject({
      id: 7,
      email: 'cliente@ejemplo.com',
      nombre: 'Cliente',
      rol: UserRole.CLIENTE,
    });
    await sequelize.close();
  });
});
