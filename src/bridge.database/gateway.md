<p class="lead">
  Bridge does all the connection stuff for you, so you can simply start using the database. The basic way of accessing
  the tables in the database is through the Gateway.
</p>

## Using the Gateway
We need to get the `Gateway` from the [Container](/docs/bridge.core/service-container). The easiest way of doing that
is to use dependency injection in for example a route handler:

```dart
router.get('users', (Gateway gateway) {
  return gateway.table('users').get();
});
```

In this example, we're returning a `Stream<Map<String, dynamic>>` in the route, which is translated to the JSON
representation of all the rows in the `users` table in the database.

```json
[
  {"id": 1, "first_name": "Jane", "last_name": "Doe", "email": "jane_doe@example.com" },
  {"id": 2, "first_name": "John", "last_name": "Doe", "email": "john_doe@example.com" },
  {"id": 3, "first_name": "Marty", "last_name": "McFly", "email": "marty@example.com" }
]
```

### Select
The `table` method on the `Gateway` instance starts a new query on a specific table. The query is built using a
stateless builder simply called `Query`. The `Query` contains methods for adding constraints on the query, as well
as different methods for executing the query on the database.

For example, the `where` method adds a `WHERE` clause to the statement. It takes a Dart callback that will be parsed
to a SQL query:

```dart
gateway.table('users')
  .where((user) => user.age > 20)
  .get();
```

```sql
SELECT * FROM "users"
WHERE "age" > 20;
```

In this example, the `get` method executes the query as a select statement and returns the rows as a stream of maps.
There are a bunch of methods on the `Query` builder, so explore it and see what you can do!

Another cool example of the so called _expression predicates_ in action is the `join` method:

```dart
gateway.table('users')
  .join('addresses', (user, address) => user.addressId == address.id)
  .get();
```

```sql
SELECT * FROM "users"
JOIN "addresses" ON "users.address_id" = "addresses.id";
```

> **Note:** Trestle is a young package, and might not contain every feature. If you're missing something, file an
> issue on the [Trestle GitHub repository](https://github.com/dart-bridge/trestle)

### Insert
To add rows to a table, we use the terminology `add`. But there's aliases for corresponding `insert` methods:

```dart
gateway.table('dark_side').add({'first_name': 'Darth', 'last_name': 'Vader'});
gateway.table('light_side').addAll([
  {'first_name': 'Obi-Wan', 'last_name': 'Kenobi'},
  {'first_name': 'Luke', 'last_name': 'Skywalker'},
]);
```

These methods return Futures that complete with `null` on success. So, to ensure that the user is informed if something
went wrong, you should probably `await`.

### Aggregates
Instead of just selecting rows, we can use aggregate methods to perform other queries:

```dart
int usersCount = await gateway.table('users').count();
double averageAge = await gateway.table('users').average('age');
int highestAge = await gateway.table('users').max('age');
int lowestAge = await gateway.table('users').min('age');
```
