<p class="lead">
  After all, Bridge is designed with the Web in mind. This library contains the HTTP server, as well as facilities for
  middleware, routing, session handling, cookies and more.
</p>

Getting started is easy as pie. Check out `lib/main/main.dart` and you'll find a class called `Main` with a method called
`routes`. The method is resolved through the [Service Container](/docs/bridge.core/service-container) so we can inject
whatever we want there. A good idea though, is to inject the `Router`! This of course is already done for you.

```dart
routes(Router router) {
  //
}
```

This method is executed once, during the initialization of the app, and is used to register route handlers on the router.
A route handler is a function that's backed by the [Service Container](/docs/bridge.core/service-container) too, and the
return value of the function will be parsed into a response object.

```dart
routes(Router router) {

  router.get('/', () {
    return '<h1>Hello, World!</h1>';
  });

}
```

However, we don't want to return the HTML directly in the route handler, right? For that we can use templates. Note, however
that the templates are part of the `bridge.view` library, not `bridge.http`.

As long as we include the `bridge.view.ViewServiceProvider` in `config/app.yaml`, we're free to use the `template` helper
from `bridge.http`.

```dart
router.get('/', () {
  return template('index');
});
```

> **Note:** Learn more about routing [here](/docs/bridge.http/router), and about `bridge.view` [here](/docs/bridge.view).
