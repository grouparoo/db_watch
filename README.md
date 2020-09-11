# db_watch

This runs a query every second or so and prints out the result if there have been changes (in one column) since the last time. I wrote this to log the state of a row in a database as it changed.

First, create and fill out the `.env` file:

```
# Sequelize Database
DATABASE_URL="postgresql://localhost:5432/database_name"

# Query to run
WATCH_QUERY="SELECT * FROM users WHERE id = 42"

# Primary key column that's different for every row
WATCH_PRIMARY_KEY="id"

# Timestamp column updated when it changes
WATCH_TIMESTAMP="updated_at"
```

Then run it:

```
> npm install
> ./db_watch
```

It makes output like this:

```
┌───────────────────────────────────────────────────────────┬─────┬─────────────────┬───────────────────────────────────┬────────────┐
│ Poll                                                      │ id  │ first_name      │ email                             │ updated_at │
├───────────────────────────────────────────────────────────┼─────┼─────────────────┼───────────────────────────────────┼────────────┤
│ Fri Sep 11 2020 09:27:00 GMT-0700 (Pacific Daylight Time) │ 1   │ Guthry          │ ghyndman0@sogou.com               │ Fri Jul 2… │
├───────────────────────────────────────────────────────────┼─────┼─────────────────┼───────────────────────────────────┼────────────┤
│ Fri Sep 11 2020 09:28:00 GMT-0700 (Pacific Daylight Time) │ 2   │ Batholomew      │ bfosh1@amazonaws.com              │ Mon Jul 1… │
├───────────────────────────────────────────────────────────┼─────┼─────────────────┼───────────────────────────────────┼────────────┤
│ Fri Sep 11 2020 09:30:00 GMT-0700 (Pacific Daylight Time) │ 3   │ Jefferson       │ jrubertis2@harvard.edu            │ Sat Jul 1… │
├───────────────────────────────────────────────────────────┼─────┼─────────────────┼───────────────────────────────────┼────────────┤
│ Fri Sep 11 2020 09:34:00 GMT-0700 (Pacific Daylight Time) │ 4   │ Brennan         │ bshoard3@cornell.edu              │ Sat Aug 0… │
├───────────────────────────────────────────────────────────┼─────┼─────────────────┼───────────────────────────────────┼────────────┤
│ Fri Sep 11 2020 09:34:00 GMT-0700 (Pacific Daylight Time) │ 5   │ Kaitlynn        │ kpresman4@columbia.edu            │ Tue Jun 3… │
├───────────────────────────────────────────────────────────┼─────┼─────────────────┼───────────────────────────────────┼────────────┤
│ Fri Sep 11 2020 09:35:00 GMT-0700 (Pacific Daylight Time) │ 6   │ Gifford         │ glindenbaum5@usatoday.com         │ Sun Aug 3… │
├───────────────────────────────────────────────────────────┼─────┼─────────────────┼───────────────────────────────────┼────────────┤
```

### TODO

There's a lot to do to make this fancy, but it solved my immediate problem and so I left it at that for now.

- pass in config via command line
- make it so it can be installed globally with `bin`
- option to not show initial value (only updates show updates)
- line up the headers better
- make sure it really does work with MySQL
- add in other databases
