exports.plugin = {
  async register(server, options) {

  server.route({
        method:'GET',
        path:'/hello',
        handler:function(request,h) {

            return 'hello world';
        }
    });
  },
  name: 'routes-misc'
};
