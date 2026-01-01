# Database

## Table of Contents

* [Creation](#creation)
* [Migrations](#migrations)
* [Schema](#schema)

---

### Creation

1. Launch `pqsl` as the `postgres` user:

   `psql -U postgres`
   
2. Create the database:

   `CREATE DATABASE <DB_NAME>;`
   
3. Create the user:

   `CREATE USER <DB_USER> WITH PASSWORD '<DB_PASSWORD>';`
   
4. Connect to the database:

   `\c <DB_NAME>`
   
5. Grant `DB_USER` access to all tables:

   `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO <DB_USER>;`
   
6. Make `DB_USER` the owner of `DB_NAME`:
    
    `ALTER DATABASE <DB_NAME> OWNER TO <DB_USER>;`
    
7. Quit as the `postgres` user:

   `\q`
   
8. Connect as `DB_USER` (provide the password when prompted):

   `psql -U <DB_USER> <DB_NAME>`
   
9. If you want to switch to the `phase10` schema, for example:
    
    `SET search_path TO phase10;`
    

---

### Migrations

1. Open a shell and change to the `packages/api` directory of the project.
2. Execute the following to run migrations:
   
    ```
    pn db-migrate-dev
    ```
   

---

### Schema

When we're ready to start auditing various events, we'll store times
as bigint columns in the audit tables, with default values that are
equivalent to what JavaScript's `Date.now()` function produces:

```sql
time  bigint  NOT NULL DEFAULT trunc(EXTRACT(EPOCH FROM now()) * 1000)
```

### Add SKIP to Deck

```sql
UPDATE phase10.games
SET deck = jsonb_build_array(jsonb_build_object('color', '', 'value', 13)) || deck;
```
