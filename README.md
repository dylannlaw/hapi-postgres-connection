# hapi-postgres-connection

Creates a PostgreSQL Connection (Pool) available anywhere in your Hapi application.

## *Why*?

You are building a PostgreSQL-backed Hapi.js Application
but don't want to be initialising a connection to Postgres
in your route handler because it's *slow* and can lead
to [*interesting* errors](https://github.com/brianc/node-postgres/issues/725).

## *What*?

Create a Connection (Pool) to PostgreSQL *once* when your server boots
and use it *anywhere* in your app.

## *How*?



## *Implementation Detail*

<br />

## *Motivation?*

> see: https://github.com/dwyl/hapi-login-example-postgres/issues/6
