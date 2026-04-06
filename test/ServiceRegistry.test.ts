import { describe, it, expect, beforeEach } from "vitest"
import { AbstractService, ServiceRegistry, ServiceState } from "../src/index.js"

class MockService extends AbstractService {}

class MockServiceWithDependency extends AbstractService {

    protected override _dependencies = [ MockService.name ]
}

class MockServiceWithNonExistentDependency extends AbstractService {

    protected override _dependencies = [ "NonExistentDependency" ]
}

class ResettableServiceRegistry extends ServiceRegistry {

    public static reset(): void {
        // Must set on ServiceRegistry directly since static properties
        // are not shared via prototype chain on write
        (ServiceRegistry as unknown as { _instance: undefined })._instance = undefined
    }
}

class MockRegistryWithNoConstructorInstance extends ServiceRegistry {

    public constructor() {
        super()

        MockRegistryWithNoConstructorInstance._instance = undefined
    }
}

describe("ServiceRegistry", () => {

    beforeEach(() => {
        ResettableServiceRegistry.reset()
    })

    describe("Singleton", () => {

        it("should get the instance of the service registry when used with `new`", () => {

            const registry = new ServiceRegistry()

            expect(registry).toBeInstanceOf(ServiceRegistry)
        })

        it("should get the instance of the service registry when used without `new`", () => {

            const registry = ServiceRegistry.instance

            expect(registry).toBeInstanceOf(ServiceRegistry)
        })

        it("should return a singleton instance even if the constructor fallback fails", () => {

            const registry = MockRegistryWithNoConstructorInstance.instance

            expect(registry).toBeInstanceOf(ServiceRegistry)
        })

        it("should be a singleton", () => {

            const registry1 = ServiceRegistry.instance
            const registry2 = new ServiceRegistry()

            expect(registry1).toBeInstanceOf(ServiceRegistry)
            expect(registry2).toBeInstanceOf(ServiceRegistry)
            expect(registry1).toBe(registry2)
        })
    })

    describe("Registering", () => {

        it("should register the service and set the correct state", async () => {

            const registry = new ServiceRegistry()

            const service = new MockService()

            await registry.register(service)
            expect(service.state).toBe(ServiceState.Initialized)
        })
    })

    describe("Starting", () => {

        it("should start the service and set the correct states", async () => {

            const registry = new ServiceRegistry()

            const service = new MockService()

            await registry.register(service)
            await registry.start()
            expect(service.state).toBe(ServiceState.Started)
        })

        it("should start a dependency correctly", async () => {

            const registry = new ServiceRegistry()

            const service = new MockServiceWithDependency()
            const dependency = new MockService()

            await registry.register(dependency)
            await registry.register(service)
            await registry.start()
            expect(service.state).toBe(ServiceState.Started)
            expect(dependency.state).toBe(ServiceState.Started)
        })

        it("should start services with dependencies correctly even if they are unordered", async () => {

            const registry = new ServiceRegistry()

            const service = new MockServiceWithDependency()
            const dependency = new MockService()

            await registry.register(service)
            await registry.register(dependency)
            await registry.start()
            expect(service.state).toBe(ServiceState.Started)
            expect(dependency.state).toBe(ServiceState.Started)
        })

        it("should throw an error when trying to start a service that is not registered", async () => {

            const registry = new ServiceRegistry()

            const service = new MockServiceWithNonExistentDependency()

            await registry.register(service)
            await expect(registry.start()).rejects.toThrow("Service NonExistentDependency is not registered")
        })
    })

    describe("Stopping", () => {

        it("should stop the service and set the correct states", async () => {

            const registry = new ServiceRegistry()

            const service = new MockService()

            await registry.register(service)
            await registry.start()
            await registry.stop()
            expect(service.state).toBe(ServiceState.Stopped)
        })

        it("should throw an error when trying to stop a service that is not registered", async () => {

            const registry = new ServiceRegistry()

            await expect(registry.stopService("NonExistentService")).rejects.toThrow(
                "Service NonExistentService is not registered"
            )
        })
    })

    describe("Reloading", () => {

        it("should reload", async () => {

            const registry = new ServiceRegistry()

            const service = new MockService()

            await registry.register(service)
            await registry.start()
            await registry.reload()
            expect(service.state).toBe(ServiceState.Started)
        })
    })

    describe("Shutting down", () => {

        it("should shutdown the service and set the correct states", async () => {

            const registry = new ServiceRegistry()

            const service = new MockService()

            await registry.register(service)
            await registry.start()
            await registry.shutdown()
            expect(service.state).toBe(ServiceState.Unloaded)
        })
    })
})
