const Boom = require('boom');
const moment = require('moment');

exports.plugin = {
  async register(server, options) {

    server.route({
        method: 'GET',
        path: '/day/topics/count',
        async handler(request) {
          try {
            const cache = await request.server.app.cacheClient.get({ id: '/day/topics/count', segment: 'api' })
            if (cache != null) {
              return cache.item;
            }
            const [rows, fields] = await request.server.app.pool.query('SELECT SUM(if(dateCreation IS NOT NULL AND dateCreation > CURRENT_DATE, 1, 0))  as nouveauxTopics, SUM(if(dateSupression IS NOT NULL AND dateSupression > CURRENT_DATE, 1, 0)) AS topicsSupprimes, SUM(if(dateSupression IS NOT NULL AND dateSupression > CURRENT_DATE, messages, 0)) AS messagesTopicsSupprimes FROM `topics`');
            await request.server.app.cacheClient.set({ id: '/day/topics/count', segment: 'api' }, rows[0], 20000);
            return rows[0];
          } catch (err) {
            throw Boom.internal('Internal Mysql Error', err)
          }
      }
    });

    server.route({
        method: 'GET',
        path: '/day/topics/deleted/last',
        async handler(request) {
          try {
            const cache = await request.server.app.cacheClient.get({ id: '/day/topics/deleted/last', segment: 'api' })
            if (cache != null) {
              return cache.item;
            }
            const [rows, fields] = await request.server.app.pool.query('SELECT id, titre, auteur, messages, dateCreation, datePremierePage, dateSupression FROM `topics` WHERE dateSupression IS NOT NULL ORDER BY dateSupression DESC LIMIT 25');
            await request.server.app.cacheClient.set({ id: '/day/topics/deleted/last', segment: 'api' }, rows, 5000);
            return rows;
          } catch (err) {
            console.log(err)
            throw Boom.internal('Internal Mysql Error', err)
          }
      }
    });

    server.route({
        method: 'GET',
        path: '/day/topics/deleted/top10',
        async handler(request) {
          try {
            const cache = await request.server.app.cacheClient.get({ id: '/day/topics/deleted/top10', segment: 'api' })
            if (cache != null) {
              return cache.item;
            }
            const [rows, fields] = await request.server.app.pool.query('SELECT id, titre, auteur, messages, dateCreation, datePremierePage, dateSupression FROM `topics` WHERE dateSupression > CURRENT_DATE ORDER BY messages DESC LIMIT 10');
            await request.server.app.cacheClient.set({ id: '/day/topics/deleted/top10', segment: 'api' }, rows, 60000);
            return rows;
          } catch (err) {
            console.log(err)
            throw Boom.internal('Internal Mysql Error', err)
          }
      }
    });

    server.route({
        method: 'GET',
        path: '/stats/topics/deleted/hourly',
        async handler(request) {
          try {
            const cache = await request.server.app.cacheClient.get({ id: '/stats/topics/deleted/hourly', segment: 'api' })
            if (cache != null) {
              return cache.item;
            }
            const baseQuery = "SELECT FROM_UNIXTIME(TRUNCATE(UNIX_TIMESTAMP(dateSupression) / 3600, 0) * 3600) as date, count(id) as nombre FROM `topics` WHERE dateSupression IS NOT NULL AND now() - INTERVAL 1 DAY <  FROM_UNIXTIME(TRUNCATE(UNIX_TIMESTAMP(dateSupression) / 3600, 0) * 3600)  GROUP BY date ORDER BY date DESC";
            const [rows, fields] = await request.server.app.pool.query(baseQuery);
            const ttl = 20000;
            await request.server.app.cacheClient.set({ id: '/stats/topics/deleted/hourly', segment: 'api' }, rows, ttl);
            return rows;
          } catch (err) {
            console.log(err)
            throw Boom.internal('Internal Mysql Error', err)
          }
      }
    });

    server.route({
        method: 'GET',
        path: '/stats/topics/created/hourly',
        async handler(request) {
          try {
            const cache = await request.server.app.cacheClient.get({ id: '/topics/created/hourly', segment: 'api' })
            if (cache != null) {
              return cache.item;
            }
            const baseQuery = "SELECT FROM_UNIXTIME(TRUNCATE(UNIX_TIMESTAMP(dateCreation) / 3600, 0) * 3600) as date, count(id) as nombre FROM `topics` WHERE dateCreation IS NOT NULL AND now() - INTERVAL 1 DAY <  FROM_UNIXTIME(TRUNCATE(UNIX_TIMESTAMP(dateCreation) / 3600, 0) * 3600) GROUP BY date ORDER BY date DESC";
            const [rows, fields] = await request.server.app.pool.query(baseQuery);
            const ttl = 30000;
            await request.server.app.cacheClient.set({ id: '/topics/created/hourly', segment: 'api' }, rows, ttl);
            return rows;
          } catch (err) {
            console.log(err)
            throw Boom.internal('Internal Mysql Error', err)
          }
      }
    });

    server.route({
        method: 'GET',
        path: '/stats/topics/deleted/daily',
        async handler(request) {
          try {
            const cache = await request.server.app.cacheClient.get({ id: '/stats/topics/deleted/daily', segment: 'api' })
            if (cache != null) {
              return cache.item;
            }
            const baseQuery = "select count(dateSupression) as nombre, DATE(dateSupression) as date from topics where dateSupression IS NOT NULL AND dateSupression between (CURDATE() - INTERVAL 31 DAY) and (CURDATE()) AND DATE(dateSupression) != CURDATE() group by DATE(dateSupression) ORDER BY `date` DESC";
            const [rows, fields] = await request.server.app.pool.query(baseQuery);
            const ttl = - moment().diff(moment().endOf('day'))
            if (ttl < 0) {
              console.error("ttl error");
            }
            if (ttl < 20000)
              ttl = 20000;
            await request.server.app.cacheClient.set({ id: '/stats/topics/deleted/daily', segment: 'api' }, rows, ttl);
            return rows;
          } catch (err) {
            console.log(err)
            throw Boom.internal('Internal Mysql Error', err)
          }
      }
    });

    server.route({
        method: 'GET',
        path: '/stats/topics/created/daily',
        async handler(request) {
          try {
            const cache = await request.server.app.cacheClient.get({ id: '/stats/topics/created/daily', segment: 'api' })
            if (cache != null) {
              return cache.item;
            }
            const baseQuery = "SELECT COUNT(dateCreation) AS nombre, DATE(dateCreation) as date FROM topics WHERE dateCreation BETWEEN(CURDATE() - INTERVAL 31 DAY) AND(CURDATE()) AND DATE(dateCreation) != CURDATE() GROUP BY DATE(dateCreation) ORDER BY `date` DESC";
            const [rows, fields] = await request.server.app.pool.query(baseQuery);
            const ttl = - moment().diff(moment().endOf('day'))
            if (ttl < 0) {
              console.error("ttl error");
            }
            if (ttl < 20000)
              ttl = 20000;
            await request.server.app.cacheClient.set({ id: '/stats/topics/created/daily', segment: 'api' }, rows, ttl);
            return rows;
          } catch (err) {
            console.log(err)
            throw Boom.internal('Internal Mysql Error', err)
          }
      }
    });

    server.route({
        method: 'GET',
        path: '/stats/count',
        async handler(request) {
          try {
            const cache = await request.server.app.cacheClient.get({ id: '/stats/count', segment: 'api' })
            if (cache != null) {
              return cache.item;
            }
            let baseQuery = "SELECT MIN(datePremierePage) as startDate FROM `topics`";
            let [rows, fields] = await request.server.app.pool.query(baseQuery);
            await request.server.app.cacheClient.set({ id: 'startDate', segment: 'api' }, rows, 10000000);

            if (!rows[0].startDate)
              throw Boom.internal('Internal error', err)
            const startDate = rows[0].startDate
            const args = [startDate];
            baseQuery = "SELECT COUNT(*) as totalTopics, SUM(IF(dateCreation > ?, 1, 0)) as totalNouveauxTopics, COUNT(dateSupression) as totalTopicsSupprimes, SUM(IF(dateSupression IS NOT NULL, messages, 0)) as totalMessagesSupprimes FROM topics";
            [rows, fields] = await request.server.app.pool.query(baseQuery, args);
            rows[0].startDate = startDate;
            await request.server.app.cacheClient.set({ id: '/stats/count', segment: 'api' }, rows[0], 60000);
            return rows[0];
          } catch (err) {
            console.log(err)
            throw Boom.internal('Internal Mysql Error', err)
          }
      }
    });

  },
  name: 'routes-stats'
};
