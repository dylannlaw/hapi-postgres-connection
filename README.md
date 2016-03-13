# hapi-postgres-connection

![hapi-postgres-connection](https://cloud.githubusercontent.com/assets/194400/13723469/73b5d8f2-e85e-11e5-82dc-943e7ebccdce.png)

Creates a PostgreSQL Connection (Pool) available anywhere in your Hapi application.

## *Why*?

You are building a PostgreSQL-backed Hapi.js Application
but don't want to be initialising a connection to Postgres
in your route handler because it's *slow* and can lead
to [*interesting* errors](https://github.com/brianc/node-postgres/issues/725) ...

## *What*?

Create a Connection (Pool) to PostgreSQL *once* when your server boots
and use it *anywhere* in your app.

Uses https://github.com/brianc/node-postgres
the *most popular* (*actively maintained*) node PostgreSQL Client.

## *How*?

### *Download/Install* from NPM

```sh
npm install hapi-postgres-connection --savex§
```

### *Intialise* the plugin in your Hapi Server



### Required/Expected Environment Variable

The plugin *expects* (*requires*) that you have an Environment Variable set
for the Postgres Connection URL: `DATABASE_URL` in the format:
`postgres://username:password@localhost/database`

> If you are unsure how to set the Environment Variable
or why this is a *good idea*  
(*hard-coding values in your app is a really bad idea...*)  
please see: https://github.com/dwyl/learn-environment-variables

## *Implementation Detail*

To run the tests *locally* you will need to have
a running instance of PostgreSQL with a database called `test` available.

Then set your `DATABASE_URL` Environment Variable, on my localhost its:
```sh
export DATABASE_URL=postgres://postgres:@localhost/test
```
(*the default `postgres` user does not have a password on localhost*)


<br />

## *Motivation?*

> see: https://github.com/dwyl/hapi-login-example-postgres/issues/6
