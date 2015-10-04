<p class="lead">
  Both the Tether and the HTTP Server use this library as a common (de-)serialization library. Simply register a data
  structure class. You can then send it as a response object in a route handler, or send it over the wire
  with the Tether. Neat!
</p>

The `Serializer` class in `bridge.transport` is one of the few classes that are available as a global object in the
Bridge eco system.

Most of your interactions with the `serializer` object are registrations of data structures. It works like this:

## Registering a data structure
Different parts of Bridge (specifically in `bridge.http` and `bridge.tether`), the `Serializer` will be asked to either
serialize or deserialize an object. Lists, maps and primitives will remain untouched, but any other objects must
be registered on the serializer, or else it will be cast to a `String` on serialization.

```dart
class MyClass {
  String property1;
  String property2;
}

serializer.register('MyClass', MyClass,
  serialize: (MyClass o) => [
    o.property1, 
    o.property2],
  deserialize: (List o) => new MyClass()
    ..property1 = o[0]
    ..property2 = o[1]);
```

Using the knowledge of how to break down and reconstruct a class, the serializer now has the ability to send instances
of that class through protocols that doesn't share state with your application (e.g. HTTP or WebSocket).

## Serializing and deserializing
Given that the code above has been run, we can now serialize any structure that contains instances of `MyClass`:

```dart
final serial = serializer.serialize([
  new MyClass()..property1 = 'a',
  new MyClass()..property1 = 'b',
  new MyClass()..property1 = 'c',
]);

// At this point, `serial` could pass through JSON.encode without errors

final rebuilt = serializer.deserialize(serial);

print(rebuilt[1].property1); // 'b'
```

## Nested objects
If you have a data structure that contains other data structures, you don't have to worry about them in the
serialization of the class, as long as they have their own protocol. The serializer recursively works through the
output of each serial data, to make sure that only primitive values remain:

```dart
class First {
  final Second second;
  
  First(Second this.second);
}

class Second {
  final String property;
  
  Second(String this.property);
}

serializer.register('First', First,
  serialize: (f) => f.second, 
  deserialize: (s) new First(s));
  
serializer.register('Second', Second,
  serialize: (s) => s.property, 
  deserialize: (p) new Second(p));
```

## Data structure registration should be shared
It's important that both sides of the transport share the exact same protocol. In the
[Bridge boilerplate app](https://github.com/dart-bridge/bridge) the file `lib/app_shared/shared_structures.dart`
contains a function that both the server and client runs. That way, both sides agree on what a serialized version of
a data structure looks like.
