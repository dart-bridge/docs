<p class="lead">
  An effective way to decouple a system is to fire domain events on important updates. This small library
  contains an elegant publish/subscribe eventing system.
</p>

To access the domain events, [inject](/docs/bridge.core/service-container#dependency-injection) the `Events` class.

## Firing events
To fire an event, you need to consider two things: the **event object** and the **event identifier**. If you simply
want to provide a string value as the event object, you should specify the event identifier explicitly. If the
identifier is omitted, the type of the event object will be used:

```dart
// Using explicit identifier
events.fire('message', as: #MyEvent);

// Using a special class
events.fire(new MyEvent());

// The above is equal to this (this is superfluous)
events.fire(new MyEvent(), as: MyEvent);
```

## Listening to events
When you're listening to an event, you need to know the identifier of that event. You will receive the event objects as
a stream:

```dart
// From the `fire` examples above
Stream<String> myEvents = events.on(#MyEvent);
Stream<MyEvent> myEvents = events.on(MyEvent);

// Callback style listener
events.on(MyEvent).listen((MyEvent event) {
  // ...
});

// Async style listener
await for (String event in events.on(#MyEvent)) {
  // ...
}
```

> **Note**: In these examples we use symbol literals for identifiers, but you can use whatever value you want. Just
> remember to use a constant, so that equality is innate.

One approach would be to send through a data structure as the event object, and classify the type of event with an
explicit event id:

```dart
class Train {
  final int passengers;
  
  Train({int this.passengers});
}

// The identifier provides context
events.fire(new Train(passengers: 10), as: #TrainLeftTheStation);
events.fire(new Train(passengers: 0), as: #TrainCrashed);
events.fire(new Train(passengers: -666), as: #GhostTrain);
```
