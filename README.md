# Serivce Registry

Service Registry is a library that provides a simple way to register
and manage services in your application. It allows you to register services
with a unique name and retrieve them later. This is useful for managing
dependencies and ensuring that services are only instantiated once.

## Features
- tbd

## Installation

You can install the library in your project using npm:

```bash
npm install @hschulz/service-registry
```

## Usage

Create a new service class.

```typescript
// src/MyService.ts

import { AbstractService } from '@hschulz/service-registry'

class MyService extends AbstractService {

    protected override async _initialize(): Promise<void> {
        console.log("MyService initialized")
    }

    protected override async _start(): Promise<void> {
        console.log("MyService started")
    }
}
```

Register the service with the registry.

```typescript
// src/index.ts

import { ServiceRegistry } from '@hschulz/service-registry'
import { MyService } from './MyService'

const registry = new ServiceRegistry()

registry.register(new MyService())

registry.start()
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
