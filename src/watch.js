require("./setup");
const Sequelize = require("sequelize");
const getSequelizeConfig = require("./sequelize").getConfig;

module.exports.cmd = async function (vargs) {
  const watcher = new Watcher(vargs);
  await watcher.run();
};

class Watcher {
  constructor(vargs) {
    this.vargs = vargs;
    this.client = this.createClient();
    this.query = vargs.query || process.env.WATCH_QUERY;
    this.primaryKey = vargs.key || process.env.WATCH_PRIMARY_KEY;
    this.watchColumn = vargs.timestamp || process.env.WATCH_TIMESTAMP;
    this.pollMs = parseInt(vargs.poll || process.env.POLL_MS || 500);
  }

  createClient(vargs) {
    const config = getSequelizeConfig(this.vargs);
    return new Sequelize(config);
  }

  async run() {
    await this.poll();
  }

  async poll() {
    const result = await this.client.query(this.query);
    console.log(result);
  }
}
