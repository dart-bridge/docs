<p class="lead">
  This is the only library you need to create a Bridge application, really. It contains the foundation for Bridge's
  Service Oriented Architecture. It also contains facilities for handling application configuration, as well as the
  IoC Container behind the Dependency Injection system that Bridge sports.
</p>

At the absolute foundation of Bridge, an `Application` object is running it all. The application only needs one thing
to work; a configurations directory (`config/` by default) containing a file called `app.yaml`. That YAML file must
contain a key called `service_providers` – a list that needs at least one item.

Every item in the `service_providers` list must be a classpath to a class that extends `ServiceProvider`. Think of the
Service Providers as bootstrappers for specific parts of the application. The built it Bridge libraries provide
their own Service Providers, which you can include in the Service Provider list if you want.

For example, the class `HttpServiceProvider` in the library `bridge.http` (yielding the classpath
`bridge.http.HttpServiceProvider`) will add the server commands to the CLI, among other things.

> **Note:** You can easily create your own Service Providers. Learn how to do that
> [here](/docs/bridge.core/service-provider)!

