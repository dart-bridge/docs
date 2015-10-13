<p class="lead">
  Since Trestle uses SQL for the most part, we need to ensure that the database schema matches our models.
</p>

## Why use migrations?
Imagine you're working with a team of multiple people and you have a database layer that you all depend on. Then
everyone on the team must have the same database schema. Or else some features will break.

Instead of dealing with the hassle of making sure that everyone has the exact same schema, we can enforce it with
migrations. Think of it as version control for your database schema!

### Commands
Each migration marks a change to the schema, and also provide a way to roll back that change. To ensure that they use
the most recent iteration, every team member simply has to run the `db_migrate` command in the Bridge CLI. To roll back
everything and return the database to its original state, we can run `db_rollback`.

Finally, if we make a change to an existing migration we can run `db_refresh` to roll back everything and then rerun
the migrations. This, however, will of course delete any rows in the tables, so instead of making a change to a
migration, we can create a new migration which alters the schema, and then run the non desctructive `db_migrate`.

## Writing the Migration
Inside `lib/migrations.dart` we have a unified place to store our migrations. Create a new class that extends the
`Migration` class. You will then be forced to implement two methods: `run` and `rollback`. Each method receives
the `Gateway` instance, which has methods to access and modify the database schema.

```dart
class CreateArticlesTable extends Migration {
  run(Gateway gateway) async {
    await gateway.create('articles', (Schema schema) {
      
      // These two fills the schema neccessary for a Model to work
      schema.id();
      schema.timestamps();
      
      // Specific to the Article model
      schema.string('name');
      schema.string('serial_number').unique();
    });
  }
  
  rollback(Gateway gateway) async {
    // This is how we roll back the creation of a table
    await gateway.drop('articles');
  }
}
```


