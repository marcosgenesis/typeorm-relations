import { createConnection, getConnectionOptions, Connection } from 'typeorm';

import { types } from 'pg';

types.setTypeParser(1700, function (val) {
  return parseFloat(val);
});
export default async (name = 'default'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      name,
      database:
        process.env.NODE_ENV === 'test'
          ? 'gostack_desafio09_tests'
          : defaultOptions.database,
    }),
  );
};
