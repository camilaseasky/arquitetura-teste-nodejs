interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'camila@autoriaweb.com.br',
      name: 'Camila da AutoriaWeb',
    },
  },
} as IMailConfig;
