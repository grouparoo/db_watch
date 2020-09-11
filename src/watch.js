require("./setup");
const Sequelize = require("sequelize");
const Table = require("cli-table");
const getSequelizeConfig = require("./sequelize").getConfig;

module.exports.cmd = async function (vargs) {
  const watcher = new Watcher(vargs);
  await watcher.run();
};

const sleep = (t) => {
  return new Promise((resolve) => {
    setTimeout(resolve, t);
  });
};

class Watcher {
  constructor(vargs) {
    this.vargs = vargs;
    this.client = this.createClient();
    this.query = vargs.query || process.env.WATCH_QUERY;
    this.primaryKey = vargs.key || process.env.WATCH_PRIMARY_KEY;
    this.columns = (vargs.columns || process.env.WATCH_COLUMNS || "")
      .split(",")
      .map((col) => col.trim());
    this.pollMs = parseInt(vargs.poll || process.env.POLL_MS || 1000);
    this.header = false;
    this.saved = {};
  }

  createClient(vargs) {
    const config = getSequelizeConfig(this.vargs);
    return new Sequelize(config);
  }

  async run() {
    while (true) {
      const now = new Date();
      await this.poll(now);
      const update = new Date();
      const ms = update.getTime() - now.getTime();
      let left = this.pollMs - ms;
      if (left < 0) {
        left = 0;
      }
      await sleep(left);
    }
  }

  // TODO: that table printer thing, can it stream?

  async poll(now) {
    const [rows, result] = await this.client.query(this.query);
    if (rows.length == 0) {
      return;
    }
    const keys = Object.keys(rows[0]);
    let table;
    if (this.header) {
      // TODO: how to set widths in this case using this.header?
      table = new Table();
    } else {
      table = new Table({ head: ["Poll"].concat(keys) });
      this.header = table;
    }

    if (this.columns.length === 0) {
      throw new Error(`no columns to watch given`);
    } else {
      for (const col of this.columns) {
        if (!keys.includes(col)) {
          throw new Error(`watch column not returned: ${col}`);
        }
      }
    }

    if (!keys.includes(this.primaryKey)) {
      throw new Error(`primary key not returned: ${this.primaryKey}`);
    }

    for (const row of rows) {
      const guid = row[this.primaryKey].toString();
      const checksum = this.buildChecksum(row);

      if (guid.length === 0) {
        throw new Error(`no primary key! ${JSON.stringify(row)}`);
      }
      const current = this.saved[guid];
      if (current == checksum) {
        continue; // it's the same! only showing changes
      }
      this.saved[guid] = checksum;

      const values = keys.map((key) => row[key] || "null");
      table.push([now.toString()].concat(values));
    }
    const output = table.toString();
    if (output.length > 0) {
      console.log(output);
    }
  }

  buildChecksum(row) {
    const values = [];
    for (const col of this.columns) {
      values.push(row[col].toString());
    }
    return values.join("|~|||~|");
  }
}
