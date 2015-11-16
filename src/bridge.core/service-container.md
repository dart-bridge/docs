<p class="lead">
  Bridge is backed by a robust Dependency Injection framework. The brains behind that is the Service Container.
  The Service Container is sometimes known as an IoC Container.
</p>

To understand what the Service Container does and why it exists, we're going to investigate the reasoning behind
it. However, you don't need to worry about all this if you don't want to. If you just want to use Dependency Injection,
you can go directly to [this page](/docs/bridge.core/service-provider) to learn more.

## Inversion of Control
IoC stands for Inversion of Control, referring to creation of abstract classes without depending on implementation.
The easiest way to understand this is to give an example:

```dart
// This is a high level interface in a system
abstract class Collaborator {
  ...
}

// This is a low level implementation of the high level interface
class LowLevelCollaborator implements Collaborator {
  ...
}

// This high level policy class depends on a collaborator, but shouldn't
// depend on the low level implementation, hence the interface.
class HighLevelPolicy {
  final Collaborator dependency;

  // However, this class needs a collaborator, so we have to use
  // the `new` keyword.
  HighLevelPolicy()
    : dependency = new LowLevelCollaborator(); // Don't do this.

  // That's bad. Instead, there are patterns that lets us push
  // the problem of creating the dependency out to the creator
  // of this class. We can use the factory pattern:
  HighLevelPolicy(Collaborator collaboratorFactory())
    : dependency = collaboratorFactory();

  // Or, we can follow the Dependency Injection pattern.
  HighLevelPolicy(this.dependency);
}
```

By pushing the problem of creation to the outside of the class, we effectively remove the dependency of the low level
implementation detail. If we keep injecting, the creation is pushed further and further outwards, until you reach the
`main` function, essentially:

```dart
main() {
  new HighLevelPolicy(
    new LowLevelCollaborator(
      new MaybeEvenLowerLevel()));
}
```

This is called Dependency Inversion, and it's a good thing, because we have isolated the configuration and instantiation
of the program into one place. Now there's a bunch of cool things you can do in main to apply other patterns to the
system:

```dart
main() {
  // The singleton pattern without static fields
  final singleton = new LowLevelCollaborator();
  new HighLevelPolicy(singleton);
  new HighLevelPolicy(singleton);

  // The decorator pattern
  final collaborator =
    new SomeDecorator(
      new SomeOtherDecorator(
        new LowLevelCollaborator()));

  // And whatever else there is to do
}
```

However, you might argue that this gets rather muddy, and that there's too much configuration coupled to the same place.
Instead, we'd like to have an object that contains all this configuration, and that can be passed around as a single,
common dependency for bootstrapper scripts instead.

---

## The Service Container
Before we learn about how the container is used in Bridge, let's see how it can be used by itself. First, let's create
a new `Container`:

```dart
final container = new Container();
```

Now, let's use it to create a new instance of a class:

```dart
class MyClass {}

main() {
  MyClass instance = container.make(MyClass);
}
```

Easy enough. It's almost as terse as saying `new MyClass()`. Now, let's introduce a collaborator.

```dart
class MyCollaborator {}
class MyClass {
  final MyCollaborator collaborator;
  MyClass(this.collaborator);
}

main() {
  MyClass instance = container.make(MyClass);
}
```

You don't have to do anything more. The container will see the arguments, and recursively create new instances of
the collaborators too!

```dart
class MyNestedCollaborator {}
class MyCollaborator {
  final MyNestedCollaborator collaborator;
  MyCollaborator(this.collaborator);
}
class MyClass {
  final MyCollaborator collaborator;
  MyClass(this.collaborator);
}

main() {
  // Still works!
  MyClass instance = container.make(MyClass);
}
```

Okay, so let's introduce an interface! Let's say we have a `Logger` that should have different implementations. Then, as
a default, you want to use a file logger implementation.

```dart
abstract class Logger {}
class FileLogger implements Logger {}
class MyClass {
  final Logger logger;
  MyClass(this.logger);
}

main() {
  // This will now throw a ContainerException
  MyClass instance = container.make(MyClass);
}
```

We now need to bind the `FileLogger` to the `Logger` interface. That's super easy:

```dart
main() {
  container.bind(Logger, FileLogger);
  MyClass instance = container.make(MyClass);
}
```

Okay, but what if there's a function that take collaborators in itself?

```dart
someFunction(MyClass collaborator) {}
```

No problem, just use the `resolve` method.

```dart
final theFunctionsReturnValue = container.resolve(someFunction);
```

Cool. Now what if the `FileLogger` needs to be a singleton? No sweat, there's a `singleton` method.

```dart
container.singleton(new FileLogger(), as: Logger);

// If the `as` parameter is not provided, the singleton will bind to its own type
container.singleton(new MyClass());

// Of course, you can pass in resolved objects as well
container.singleton(container.make(MyClass));
```

Okay, but how do I actually pass in data into the arguments of the instantiation?

```dart
someFunction(MyClass myClass, String data) {}
```

The container can't instantiate a `String`, so `container.resolve(someFunction)` will fail! Ah, but we can curry the
function! The `curry` method returns a function that can be called with parameters, that will then (by their type) be
mapped over to the parameters of the original function. The other arguments will be resolved through the container.

```dart
Function curriedFunction = container.curry(someFunction);

final originalFunctionReturnValue = curriedFunction('My string');

// Essentially the same as
someFunction(container.make(MyClass), 'My string');
```

The more dynamic the argument list, the more unpredictable the `curry` method gets. Instead, there are two more ways
to get data into the resolving of a constructor or function. Both the `curry`, `resolve` and `make` methods have the
named arguments `injecting` and `namedArguments`.

```dart
functionWithArgument(MyClass myClass, String data) {}
functionWithNamed(MyClass myClass, {String data}) {}

main() {
  // Inject 'My string' every time a String is requested
  container.resolve(functionWithArgument, injecting: {
    String: 'My string'
  });

  // Inject 'My string' as the named parameter 'data'
  container.resolve(functionWithNamed, namedArguments: {
    'data': 'My string'
  });
}
```

Finally, let's look at decorators! Decorators are classes that implement an interface and receives an instance of that
interface in the constructor, passing through the methods to that injected instance while potentially adding behaviour
or changing input/output of the method.

```dart
class LoggerDecorator implements Logger {
  final Logger _logger;
  LoggerDecorator(this._logger);

  ...
}
```

There's a nifty `decorate` method on the container that adds the decorator to every new instance of the class.

```dart
container.bind(Logger, FileLogger);
container.decorate(Logger, decorator: LoggerDecorator);

// Creates a LoggerDecorator that received a FileLogger in the constructor
container.make(Logger);
```

You can add multiple decorators to the same class, either by using the `decorators` parameter that takes an iterable
with decorator types, and/or by running the decorate method multiple times.

## Bridge does most of the work for you
In Bridge, the Service Container is already hooked up to the [Service Providers](/docs/bridge.core/service-provider),
and the `Container` class is itself a singleton inside it. All you need to do to get access to the container is to
inject it:

```dart
abstract class MyInterface {}
class MyClass implements MyInterface {}

class MyServiceProvider {
  setUp(Container container) {
    container.bind(MyInterface, MyClass);
    print(container.make(MyInterface)); // Instance of 'MyClass'
  }
}
```

