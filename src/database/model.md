<p class="lead">
  To get more control over the data structures used to map over the database rows by the Repository, we can let
  our data structured extend the Model class.
</p>

If the `Repository` get a normal PODO (Plain Old Dart Object) as the type argument, every getter-setter property will
be used for the corresponding table column. But if the type argument is a subclass of (or mixes in) the `Model` class,
only the properties annotated with the `Field` constant will be used.

## What's the difference?
Here's a data structure and a model that does the same thing in the repository:

```dart
// PODO
class Person {
  int id;
  DateTime created_at;
  DateTime updated_at;
  String first_name;
  String last_name;
  int age;
  String email;
}

// Model
class Person extends Model {
  @Field('first_name') String firstName;
  @Field('last_name') String lastName;
  @field int age;
  @field String email;
}
```

Above we can see that the `Model` adds an `id` property, as well as `createdAt` and `updatedAt` timestamps. The model
also has the ability to use camel case in the properties without breaking convention in the database.

Both of these approaches are completely decoupled from the actual database details, so that we can use these classes
on the client side as well.

> **Note:** Before using these classes with a SQL implementation, we have to [migrate](/docs/bridge.database/migration)
> the database so we have a matching schema.
