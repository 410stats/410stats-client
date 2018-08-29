const Boom = require('boom');
const moment = require('moment');


exports.plugin = {
  async register(server, options) {

    server.route({
        method: 'GET',
        path: '/connected/last',
        async handler(request) {
          try {
            const cache = await request.server.app.cacheClient.get({ id: '/connected/last', segment: 'api' })
            if (cache != null) {
              return cache.item;
            }
            const [rows, fields] = await request.server.app.pool.query('SELECT * FROM connected ORDER BY date DESC LIMIT 1');
            await request.server.app.cacheClient.set({ id: '/connected/last', segment: 'api' }, rows[0], 5000);
            return rows[0];
          } catch (err) {
            throw Boom.internal('Internal Mysql Error', err)
          }
      }
    });

    server.route({
      method: 'GET',
      path: '/connected/24h',
      config: {
        tags: ['api'],
        description: 'Nombres de connectés sur 24 heures lissés sur 5 minutes',
        validate: {
        },
        async handler(request) {
          try {
              const cache = await request.server.app.cacheClient.get({ id: '/connected/24h', segment: 'api' })
              if (cache != null) {
                return cache.item;
              }
              const baseQuery = "SELECT FROM_UNIXTIME(TRUNCATE(UNIX_TIMESTAMP(connected.date) / 600, 0) * 600) as date, floor(avg(connected)) as connected FROM connected WHERE now() - INTERVAL 1 DAY < date GROUP BY FROM_UNIXTIME(TRUNCATE(UNIX_TIMESTAMP(connected.date) / 600, 0) * 600) ORDER BY date DESC";
              const [rows, fields] = await request.server.app.pool.query(baseQuery);
              await request.server.app.cacheClient.set({ id: '/connected/24h', segment: 'api' }, rows, 15000);
              return rows;
          } catch (err) {
            console.log(err);
            throw Boom.internal('Internal Mysql Error', err)
          }
        }
      }
    });

    server.route({
      method: 'GET',
      path: '/connected/week',
      config: {
        tags: ['api'],
        description: 'Returns data about profil profil_id',
        validate: {
        },
        async handler(request) {
          try {
              const cache = await request.server.app.cacheClient.get({ id: '/connected/week', segment: 'api' })
              if (cache != null) {
                return cache.item;
              }
              const baseQuery = "SELECT FROM_UNIXTIME(TRUNCATE(UNIX_TIMESTAMP(connected.date) / 3600, 0) * 3600) as date, floor(avg(connected)) as connected FROM connected WHERE now() - INTERVAL 7 DAY < date GROUP BY FROM_UNIXTIME(TRUNCATE(UNIX_TIMESTAMP(connected.date) / 3600, 0) * 3600) ORDER BY date DESC";
              const [rows, fields] = await request.server.app.pool.query(baseQuery);
              const ttl = - moment().diff(moment().endOf('hour'))
              if (ttl < 0) {
                console.error("ttl error");
              }
              if (ttl < 10000)
                ttl = 10000;
              await request.server.app.cacheClient.set({ id: '/connected/week', segment: 'api' }, rows, ttl);
              return rows;
          } catch (err) {
            console.log(err);
            throw Boom.internal('Internal Mysql Error', err)
          }
        }
      }
    });

    server.route({
      method: 'GET',
      path: '/connected/month',
      config: {
        tags: ['api'],
        description: 'Returns data about profil profil_id',
        validate: {
        },
        async handler(request) {
          try {
            const cache = await request.server.app.cacheClient.get({ id: '/connected/month', segment: 'api' })
            if (cache != null) {
              return cache.item;
            }
            const baseQuery = "SELECT DATE(date) as date, floor(avg(connected)) as connected FROM connected WHERE connected.date BETWEEN(CURDATE() - INTERVAL 31 DAY) AND(CURDATE()) GROUP BY DATE(date) ORDER BY `date` DESC";
            const [rows, fields] = await request.server.app.pool.query(baseQuery);
            const ttl = - moment().diff(moment().endOf('day'))
            if (ttl < 0) {
              console.error("ttl error");
            }
            if (ttl < 10000)
              ttl = 10000;
            await request.server.app.cacheClient.set({ id: '/connected/month', segment: 'api' }, rows, ttl);
            return rows;
          } catch (err) {
            console.log(err);
            throw Boom.internal('Internal Mysql Error', err)
          }
        }
      }
    });
  },
  name: 'routes-connected'
};
