<p class="lead">
  Let's see how Bridge works, shall we?
</p>

## Initial commands
The first thing we'll do is make sure we can start up the server and see something in the browser without issues:

```bash
$ dart bridge
```
```bridge-cli
= start
Server started on http://localhost:1337
=
```

Open [the URL](http://localhost:1337) and you should see the Bridge logo.

Next, we want the program to restart when we change any source file. To do that, we can run the `watch` command.
However, after the restart the server will have stopped. To change what commands will be run on each restart, we have
to provide them in the argument list of the `dart bridge` command.

To start the server, and restart both the program and the server on each file change, we can run this command:

```bash
$ dart bridge start, watch
```

## Hello World
When that's done, we can go into the project and change what we see in the browser.

Go to the file `lib/main/main.dart`. Your file might look a little different, but this is the gist of it. Focus on the 
`routes` method on the `Main` class:

```dart
// lib/main/main.dart

...

class Main {
  PagesController controller;
  
  Main(this.controller);

  routes(Router router) {
    router.get('/', controller.index).named('index');
  }
}
```

Right now, a `PagesController` is injected in the `Main` class constructor. The `routes` method registers a route that
listens for `GET` requests on the root (`/`) uri. The second argument in the call is the function that will respond to
each request. Here we're delegating that to an `index` method on the controller. Finally, it's naming the route `index`.

Let's change this up a bit by creating our own route:

```dart
routes(Router router) {
  router.get('/', () {
    return 'Hello, World!';
  });
}
```

Save the file and reload the browser, you should now see "Hello, World!" there!

But returning simple values isn't really what we want, right? Let's change the closure to return a template:

```dart
routes(Router router) {
  router.get('/', () {
    return template('index');
  });
}
```

---

If you go back to the browser now, we'll once again see the Bridge logo. So let's find that template!

```chalk
// lib/templates/index.chalk.html

@extends ('app')

@start block ('content')
  ... // There's a bunch of HTML here
@end block
```

What you're seeing here is a Chalk template. Chalk is Bridge's server side templating engine. Let's just replace
everything in this file with some basic html:

```chalk
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <h1>Hello again, World!</h1>
  </body>
</html>
```

The browser should not contain any surprises right now. Just a heading with the message. But we can do loads of cool
stuff here! For example, try this:

```chalk
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <h1>1 + 1 = ${1 + 1}</h1>
  </body>
</html>
```

> **Note:** If you want to learn more about Chalk, go [here](/docs/bridge.view/chalk)!
