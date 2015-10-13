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

In the `handler` function, we now have a repository connected to a table on the database called `my_data_structures`.
Notice that the convention is plural form snake case:

* `User`: `users`
* `Page`: `pages`
* `Address`: `addresses`
* `DeathStar`: `death_stars`

> **Note:** The Repository will append an "s" to the end of the singular form. Unless that ends with an "s", in which
> case "es" will be appended instead, as seen in the `Address` example above.

If you need to override this convention, you need to [extend the repository class](#extended-repositories).

## Using the Repository
You can think of the repository as a direct translation of a [gateway table call](/docs/bridge.database/gateway), but
instead of returning maps, it returns the data structure that you specify. Similarly, the `Repository` takes data
structures as input to `add` and `addAll` methods, instead of maps.

```dart
handler(Gateway gateway, Repository<User> users) {

  // returns a Stream<Map<String, dynamic>>
  gateway.table('users')
    .where((user) => user.age > 20).get();
    
  // returns a Stream<User>
  users
    .where((user) => user.age > 20).get();
    
  gateway.table('users')
    .add({ 'first_name': 'Santa' });
    
  users
    .add(new User()..firstName = 'Santa');
}
```

There are also a few helper methods available for the `Repository` that the gateway queries don't have:

```dart
users.find(1); /* is equal to */ users.where((user) => user.id == 1).first();
users.all(); /* executes the same query as */ gateway.table('users').get();
```

## Relationships
Currently, the only type of relationships available is "one to many":

```dart
handler(Repository<Player> players, Repository<Equipment> equipment) {
  Player player1 = await players.find(1);
  Stream<Equipment> inventory = players.relationship(player1).hasMany(Equipment).get();
  
  Equipment sword = await equipment.where((e) => e.name == 'Sword').first();
  Player swordOwner = await equipment.relationship(sword).belongsTo(Player);
}
```

## Extended Repositories
To override conventions, or simply to have a good place for query scopes and so on, it might be a good idea to extend
the `Repository` class:

```dart
class ArticlesRepository extends Repository<Article> {
  String get table => 'articles_table';
  
  Stream<Category> categoriesOf(Article article) {
    return relationship(article).hasMany(Category).get();
  }
}
```
