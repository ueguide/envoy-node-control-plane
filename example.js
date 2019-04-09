const grpc = require('grpc')
const xds = require('./src')

function main() {
  var server = new grpc.Server();
  const store = require('./example/data')
  
  xds.cds.registerServices( server, store )
  xds.lds.registerServices( server, store )
  xds.rds.registerServices( server, store )
  xds.eds.registerServices( server, store )

  server.bind('0.0.0.0:3000', grpc.ServerCredentials.createInsecure())
  server.start();
  console.log('grpc server started, listening on port 3000')
}

main()
