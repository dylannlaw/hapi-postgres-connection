# hapi-postgres-connection

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
npm install hapi-postgres-connection --save
```

### *Intialise* the plugin in your Hapi Server



### Required/Expected Environment Variable

The plugin *expects* (*requires*) that you have an Environment Variable set
for the Postgres Connection URL: `POSTGRES_URL` in the format:
`postgres://username:password@localhost/database`

> If you are unsure how to set the Environment Variable
or why this is a *good idea*  
(*hard-coding values in your app is a really bad idea...*)  
please see: https://github.com/dwyl/learn-environment-variables

## *Implementation Detail*

<br />

## *Motivation?*

> see: https://github.com/dwyl/hapi-login-example-postgres/issues/6
