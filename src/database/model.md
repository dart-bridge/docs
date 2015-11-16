<p class="lead">
  To get more control over the data structures used to map over the database rows by the Repository, we can let
  our data structured extend the Model class.
</p>

The `Repository` maps rows in the database over to Dart classes. They can do that in three different ways:

* Plain Old Dart Objects (PODOs)
* Value Objects
* Models

PODOs and Value Objects can be completely unaware that they are being used by an ORM. That's great for highly
decoupled systems. But if we want more ORM features we need the classes to inherit from (or mix in) the `Model`
class.

#### PODO
```dart
class Person {
  String firstName;
  String lastName;
  int age;
}
```

#### Value Object
```dart
class Person {
  final String firstName;
  final String lastName;
  final int age;

  const Person(this.firstName, this.lastName, this.age);
}
```

The above classes has no source code dependency on Trestle or Bridge, so it can live in a library
that doesn't even know how it's being used.

#### Model
```dart
class Person extends Model {
  @field String firstName;
  @field String lastName;
  @field int age;

  // Relationships can only be done by the ORM with
  // Models. Here, every [Person] has an [Address]
  @hasOne Address home;
}
```

The `Model` is a different story. When we inherit from the `Model` class, the ORM will no longer map every field
to a table column. Instead we use the `@field` annotation to explicitly dictate what fields will be mapped.

A `Model` also has the ability to have relationships be automatially mapped by Trestle.

---

Both PODOs, Models and Value Objects can be used very easily with the ORM. Just inject an instance of `Repository`,
providing the class to map to as a type argument:

```dart
// An example of the Repository being injected in a route handler.
router.get('people', (Repository<Person> persons) {
  Stream<Person> everyone = persons.all();
});
```

## Conventions
Trestle follows SQL conventions automatically. Let's look at the `Person` class from above:

```dart
class Person {
  String firstName;
  String lastName;
  int age;
}
```

This class will directly map over to a conventional database structure (represented as pseudo SQL):

```
table "persons" (
  first_name
  last_name
  age
)
```

Right away we can notice two things:

* Both camelCase and UpperCamelCase is converted to snake_case.
* The table name is plural version of class name.

Here's another example:

```dart
class HomeAddress {
  String street;
  int houseNumber;
}
```
```
table "home_addresses" (
  street
  house_number
)
```

To override these conventions, here are a few tricks:

```dart
class PieceOfClothing {
  static const table = 'pieces_of_clothing'; // as opposed to "piece_of_clothings"
}

class Thing {
  @Field('title') String name; // overriding the column name
}
```

> **Note:** Before using these classes with a SQL implementation, we have to [migrate](/docs/bridge.database/migration)
> the database so we have a matching schema.
