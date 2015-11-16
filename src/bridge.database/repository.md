<p class="lead">
  Trestle isn't just a database gateway, it's also a full fledged ORM.
</p>

## Injecting the Repository
Much like everything else in the Bridge eco-system, the `Repository` class is injected by the
[Service Container](/docs/bridge.core/service-container). However, it needs a type argument containing the data
structure to map database rows to.

```dart
class MyDataStructure {
  String data;
}

handler(Repository<MyDataStructure> structures) {
  // ..
}
```

## Using the Repository
You can think of the repository as a direct translation of a [gateway table call](/docs/bridge.database/gateway), but
instead of returning maps, it returns the data structure that you specify. Similarly, the `Repository` takes data
structures as input, and uses a `save` method rather than an `add` method.

```dart
handler(Gateway gateway, Repository<User> users) {

  // returns a Stream<Map<String, dynamic>>
  gateway.table('users')
    .where((user) => user.age > 20).get();

  // returns a Stream<User>
  users
    .where((user) => user.age > 20).get();

  gateway.table('users')
    .add({ 'first_name': 'George' });

  users
    .save(new User()..firstName = 'George');
}
```

There are also a few helper methods available for the `Repository` that the gateway queries don't have:

```dart
users.find(1); /* is equal to */ users.where((user) => user.id == 1).first();
users.all(); /* executes the same query as */ gateway.table('users').get();
```

