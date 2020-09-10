module.exports.getConfig = function (vargs) {
  let dialect = "postgres";
  let host = process.env.DB_HOST || "127.0.0.1";
  let port = process.env.DB_PORT || "5432";
  let database = process.env.DB_DATABASE || undefined;
  let username = process.env.DB_USER || process.env.CI ? "postgres" : undefined;
  let password = process.env.DB_PASS || undefined;

  if (process.env.NODE_ENV === "test") {
    database = database || "db_watch";
    // `${databaseBaseName}_${config.process.env}${
    ///   process.env.JEST_WORKER_ID ? "_" + process.env.JEST_WORKER_ID : ""
    // }`;
  }
  // if your environment provides database information via a single JDBC-style URL
  // like mysql://username:password@hostname:port/default_schema
  const connectionURL =
    vargs.database ||
    process.env.DATABASE_URL ||
    process.env.MYSQL_URL ||
    process.env.PG_URL;

  if (!connectionURL && !database) {
    throw new Error("Need a database");
  }

  if (connectionURL) {
    const parsed = new URL(connectionURL);
    if (parsed.protocol) {
      dialect = parsed.protocol.slice(0, -1);
    }
    if (parsed.username) {
      username = parsed.username;
    }
    if (parsed.password) {
      password = parsed.password;
    }
    if (parsed.hostname) {
      host = parsed.hostname;
    }
    if (parsed.port) {
      port = parsed.port;
    }
    if (parsed.pathname) {
      database = parsed.pathname.substring(1);
    }
  }

  if (dialect === "postgresql") {
    dialect = "postgres";
  }

  return {
    autoMigrate: false,
    logging: false,
    dialect: dialect,
    port: parseInt(port),
    database: database,
    host: host,
    username: username,
    password: password,
  };
};
