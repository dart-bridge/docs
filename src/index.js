module.exports = {
    categories: [

      // Getting Started
      {
        label: 'Getting Started',
        pages: [
          {
            title: 'Installation',
            endpoint: 'installation',
            location: 'tour/installation',
          },
          {
            title: 'Hello World',
            endpoint: 'hello-world',
            location: 'tour/hello-world',
          },
        ]
      },

      // bridge.core
      {
        label: 'bridge.core',
        pages: [
          {
            title: 'Overview',
            endpoint: 'bridge.core',
            location: 'bridge.core/index',
          },
          {
            title: 'Service Container',
            url: 'bridge.core/service-container',
          },
          {
            title: 'Service Provider',
            url: 'bridge.core/service-provider',
          },
        ]
      },

      // bridge.cli
      {
        label: 'bridge.cli',
        pages: [
          {
            title: 'Overview',
            endpoint: 'bridge.cli',
            location: 'bridge.cli/index',
          },
        ]
      },

      // bridge.http
      {
        label: 'bridge.http',
        pages: [
          {
            title: 'Overview',
            endpoint: 'bridge.http',
            location: 'bridge.http/index',
          },
          {
            title: 'Router',
            url: 'bridge.http/router',
          },
          {
            title: 'Middleware',
            url: 'bridge.http/middleware',
          },
        ]
      },

      // bridge.database
      {
        label: 'bridge.database',
        pages: [
          {
            title: 'Overview',
            endpoint: 'bridge.database',
            location: 'bridge.database/index',
          },
          {
            title: 'Gateway',
            url: 'bridge.database/gateway',
          },
          {
            title: 'Repository',
            url: 'bridge.database/repository',
          },
          {
            title: 'Model',
            url: 'bridge.database/model',
          },
          {
            title: 'Migration',
            url: 'bridge.database/migration',
          },
        ]
      },

      // bridge.tether
      {
        label: 'bridge.tether',
        pages: [
          {
            title: 'Overview',
            endpoint: 'bridge.tether',
            location: 'bridge.tether/index',
          },
        ]
      },

      // bridge.view
      {
        label: 'bridge.view',
        pages: [
          {
            title: 'Overview',
            endpoint: 'bridge.view',
            location: 'bridge.view/index',
          },
          {
            title: 'Chalk Templates',
            url: 'bridge.view/chalk',
          },
        ]
      },

      // bridge.transport
      {
        label: 'bridge.transport',
        pages: [
          {
            title: 'Overview',
            endpoint: 'bridge.transport',
            location: 'bridge.transport/index',
          },
        ]
      },

      // bridge.events
      {
        label: 'bridge.events',
        pages: [
          {
            title: 'Overview',
            endpoint: 'bridge.events',
            location: 'bridge.events/index',
          },
        ]
      },

      // bridge.validation
      {
        label: 'bridge.validation',
        pages: [
          {
            title: 'Overview',
            endpoint: 'bridge.validation',
            location: 'bridge.validation/index',
          },
        ]
      },

      // bridge.exceptions
      {
        label: 'bridge.exceptions',
        pages: [
          {
            title: 'Overview',
            endpoint: 'bridge.exceptions',
            location: 'bridge.exceptions/index',
          },
        ]
      },
    ]
  };
