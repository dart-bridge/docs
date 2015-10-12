<p class="lead">
  To access the database, Bridge is powered by Trestle, a unified database gateway abstraction and ORM system that
  makes it possible to use MySQL, SQLite, PostgreSQL as well as an in memory database implementation.
</p>

To use `bridge.database`, you have to use its Service Provider. In `config/app.yaml`, include this item under the
`service_providers` list:

```yaml
# config/app.yaml

service_providers
- bridge.database.DatabaseServiceProvider
```

Next, use `config/database.yaml` to configure the database layer. The `driver` key specifies what database
implementation Trestle should use. The available ones are `in_memory`, `sqlite`, `my_sql` and `postgres`.

Use the driver specific configuration to further configure the database.

```yaml
# config/database.yaml

driver: my_sql

drivers:
  my_sql:
    host: db.example.com
    port: 1234
    database: my_database
    
  # More configuration is available for the SQL drivers
```



