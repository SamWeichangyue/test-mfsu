const  WebpackDevServer = require('webpack-dev-server');
const  webpack = require('webpack');
const  getConfig = require('./webpack.config.mfsu');
const { MFSU } = require('@umijs/mfsu');

const mfsu = new MFSU({
  implementor: webpack,
  buildDepWithESBuild: true,
});

const cwd = process.cwd()

async function runDev() {
        const config = await getConfig.dev(cwd, mfsu);
        const compiler = webpack(config);
        const serverConfig = {
          port: 8080,
          host: 'localhost',
          client: {
            logging: "none",
            overlay: {
              errors: true,
              warnings: false
            },
            progress: true,
            reconnect: false,
          },
          setupMiddlewares(middlewares, devServer) {
            middlewares.unshift(
              ...mfsu.getMiddlewares()
            )
            return middlewares
          },
          // compress: true,
          // hot: "only",
          // proxy,
          // headers: {
          //   'access-control-allow-origin': '*',
          // },
          static:{
            watch: {
              ignored: /node_modules/,
            },
          },
        };
        const devServer = new WebpackDevServer(serverConfig, compiler);

        const runServer = async () => {
          console.log('\nStarting the development server...\n');
          await devServer.start();
        };
        runServer();
}
runDev()