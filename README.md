# Service Registry

A library for managing modular services with dependency resolution, lifecycle management, and topological ordering.

## Features

- **Service lifecycle management** - initialize, start, stop, reload, and unload services
- **Dependency resolution** - services declare dependencies and are started in the correct order via a DAG
- **Singleton registry** - a single registry instance manages all services
- **State tracking** - each service exposes its current state (`unknown`, `initializing`, `initialized`, `starting`, `started`, `stopping`, `stopped`, `reloading`, `unloading`, `unloaded`, `error`)

## Installation

```bash
npm install @hschulz/service-registry
```

## Usage

Create a service by extending `AbstractService`:

```typescript
import { AbstractService } from "@hschulz/service-registry"

class DatabaseService extends AbstractService {

    protected override async _initialize(): Promise<void> {
        // Set up connection pool
    }

    protected override async _start(): Promise<void> {
        // Connect to database
    }

    protected override async _stop(): Promise<void> {
        // Disconnect from database
    }
}
```

Declare dependencies between services:

```typescript
class UserService extends AbstractService {

    protected override _dependencies = [DatabaseService.name]

    protected override async _start(): Promise<void> {
        // DatabaseService is guaranteed to be started first
    }
}
```

Register and start all services:

```typescript
import { ServiceRegistry } from "@hschulz/service-registry"

const registry = new ServiceRegistry()

await registry.register(new DatabaseService())
await registry.register(new UserService())

// Starts services in dependency order
await registry.start()

// Gracefully stop and unload all services
await registry.shutdown()
```

## API

### `ServiceRegistry`

| Method | Description |
| --- | --- |
| `static get instance` | Returns the singleton instance. |
| `register(service)` | Initializes and registers a service. |
| `registerAll(services)` | Registers multiple services. |
| `start()` | Starts all services in dependency order. |
| `stop()` | Stops all services in reverse dependency order. |
| `reload()` | Reloads all services. |
| `shutdown()` | Stops and unloads all services. |
| `startService(name)` | Starts a single service by name. |
| `stopService(name)` | Stops a single service by name. |
| `reloadService(name)` | Reloads a single service by name. |
| `unregister(name)` | Stops, unloads, and removes a service. |

### `AbstractService`

Extend this class and override the lifecycle hooks:

| Method | Description |
| --- | --- |
| `_initialize()` | Called during registration. |
| `_start()` | Called when the service is started. |
| `_stop()` | Called when the service is stopped. |
| `_unload()` | Called during unregistration. |

Properties:

| Property | Description |
| --- | --- |
| `state` | The current `ServiceState` of the service. |
| `dependencies` | Array of service names this service depends on. |

### `ServiceState`

Enum of all possible service states: `Unknown`, `Initializing`, `Initialized`, `Unloading`, `Unloaded`, `Starting`, `Started`, `Stopping`, `Stopped`, `Reloading`, `Error`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
