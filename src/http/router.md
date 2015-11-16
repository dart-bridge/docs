<p class="lead">
  Bridge's intelligent router enables quick conversion from HTTP request/input to expressive responses.
</p>

### Basic usage
Getting started with the router is super easy. We'll assume that we're working inside the `Main#routes` method inside
`lib/main/main.dart`, even though the router can be accessed from anywhere where we have Dependency Injection.

```dart
routes(Router router) {
  router.get('/', () {
    return 'Hello, World!';
  });
}
```

There are methods for the different HTTP verbs, like `get`, `post`, `put`, `patch`, `delete`.

```dart
router.get('foo', () => 'foo'); // GET /foo
router.post('/bar', () => 'bar'); // POST /bar
router.put('baz/fizz', () => 'baz'); // PUT /baz/fizz
```

> **Note:** You can see all the registered routes at runtime by running the `routes` command in the CLI.

#### Wildcards
Wildcards in the registered route endpoint are mapped over to named arguments in the route handlers:

```dart
router.get('posts/:slug', ({String slug}) => slug);
```

#### Route Attachments
Each of the HTTP verb methods return a builder that can attach information to the route in question. For example, routes
can be named so that we don't rely on the actual route endpoint too much; it might change!

```dart
router.get('/', () => null)
      .named('home');
```

Each route can also ignore or add to the list of [Middleware](/docs/bridge.http/middleware) that will be used for the
request. Use the methods `ignoreMiddleware` and `withMiddleware`:

```dart
router.post('users', () => null)
      .named('users.store')
      .withMiddleware(SomeSpecialMiddleware)
      .ignoreMiddleware(CsrfMiddleware);
```

If the handler is a remote function (like a controller method), we might in some case want to send through something
that we have at initialization time. We can use the `inject` attachment to include instances to use for specific type
injections.

```dart
router.get('allo', (String name) => 'Hello, $name!')
      .inject('stranger');

router.get('foo', (FooInterface f) => '')
      .inject(new FooImplementation(), as: FooInterface);
```

#### Groups
If some route endpoints belong together, or share some attachment, it might be a good idea to group them.

```dart
router.group('comments', () {

  router.get('new', commentsController.create)
        .named('create');

  router.get('remove', commentsController.delete)
        .named('delete');

}).named('comments')
  .withMiddleware(SomeAdminMiddleware);
```

The above registers two routes, both of which using a `SomeAdminMiddleware`:

| Name            | URL             |
|-----------------|-----------------|
| comments.create | comments/new    |
| comments.delete | comments/remove |

> **Note:** Nested groups with name parts get joined with dots.

#### Resources
The RESTful resources convention can be easily followed with the `resource` method:

```dart
class PostsController {
  index() {}
  create() {}
  store() {}
  show({String id}) {}
  edit({String id}) {}
  update({String id}) {}
  destroy({String id}) {}
}

...

router.resource('posts', new PostsController());
```

The above generates the following routes:

| Method | Name          | Endpoint        | Handler                 |
|--------|---------------|-----------------|-------------------------|
| GET    | posts.index   | /posts          | PostsController#index   |
| GET    | posts.create  | /posts/create   | PostsController#create  |
| POST   | posts.store   | /posts          | PostsController#store   |
| GET    | posts.show    | /posts/:id      | PostsController#show    |
| GET    | posts.edit    | /posts/:id/edit | PostsController#edit    |
| PUT    | posts.update  | /posts/:id      | PostsController#update  |
| DELETE | posts.destroy | /posts/:id      | PostsController#destroy |

It will only generate the routes that has the expected handler on the controller. If the controller only had the `index`
method the only route registered would be `posts.index`.



