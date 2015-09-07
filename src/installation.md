<p class="lead">
  Installing Bridge is super easy. Here's a step by step guide!
</p>

## Installing Dart
First of all you need to have the [Dart SDK](https://www.dartlang.org/downloads) installed.
You can do that [here](https://www.dartlang.org/downloads).

## Installception
To simplify the process of creating new Bridge projects, we provide an installer utility, which
can be installed via [Pub](https://pub.dartlang.org). Since you installed the SDK in the previous
step, we should have access to the executable `pub`. To _install the installer_, please run the
following command:

```bash
$ pub global activate new_bridge
```

## Creating a project
To create a new project, change the terminal directory to where you store your projects:

```bash
$ cd ~/code
```

Then, we use the installer we installed above to create a new project:

```bash
$ new_bridge my_project
```

*Ta da!* You're done! Go into the project and fire it up!

```bash
$ cd my_project
$ dart bridge
```

## Optional installer flags
There are two flags available to the `new_bridge` executable:

* `--plain` creates a minimal project without all the non required boilerplate
* `--dev` uses the development branches of both the boilerplate and framework repositories to create the project
