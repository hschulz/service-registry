import { expect } from "chai"
import { AbstractService, ServiceRegistry, ServiceState } from ".."

class MockService extends AbstractService {}

class MockServiceWithDependency extends AbstractService {

    protected override _dependencies = [ MockService.name ]
}

class MockServiceWithNonExistentDependency extends AbstractService {

    protected override _dependencies = [ "NonExistentDependency" ]
}

class MockRegistryWithNoConstructorInstance extends ServiceRegistry {

    public constructor() {
        super()

        MockRegistryWithNoConstructorInstance._instance = undefined
    }
}

describe("ServiceRegistry", () => {

    describe("Singleton", () => {

        it("should get the instance of the service registry when used with `new`", () => {

            const registry = new ServiceRegistry()

            expect(registry).instanceOf(ServiceRegistry)
        })

        it("should get the instance of the service registry when used without `new`", () => {

            const registry = ServiceRegistry.instance

            expect(registry).instanceOf(ServiceRegistry)
        })

        it("should return a singleton instance even if the constructor fallback fails", () => {

            const registry = MockRegistryWithNoConstructorInstance.instance

            expect(registry).instanceOf(ServiceRegistry)
        })

        it("should be a singleton", () => {

            const registry1 = ServiceRegistry.instance
            const registry2 = new ServiceRegistry()

            expect(registry1).instanceOf(ServiceRegistry)
            expect(registry2).instanceOf(ServiceRegistry)
            expect(registry1).equal(registry2)
        })
    })

    describe("Registering", () => {

        it("should register the service and set the correct state", async () => {

            const registry = new ServiceRegistry()

            const service = new MockService()

            registry
            .register(service)
            .then(() => {
                expect(service.state).equal(ServiceState.Initialized)
            })
            .catch((error) => {
                throw error
            })
        })
    })

    describe("Starting", () => {

        it("should start the service and set the correct states", async () => {

            const registry = new ServiceRegistry()

            const service = new MockService()

            registry
            .register(service)
            .then(() => registry.start())
            .then(() => {
                expect(service.state).equal(ServiceState.Stopped)
            })
            .catch((error) => {
                throw error
            })
        })

        it("start a service and not error if it is already started", async () => {

            const registry = new ServiceRegistry()

            const service = new MockService()

            registry
            .register(service)
            .then(() => registry.start)
            .then(() => registry.start)
            .then(() => {
                expect(service.state).equal(ServiceState.Started)
            })
        })

        it("should start a dependency correctly", async () => {

            const registry = new ServiceRegistry()

            const service = new MockServiceWithDependency()
            const dependency = new MockService()

            registry
            .register(dependency)
            .then(() => registry.register(service))
            .then(() => registry.start())
            .then(() => {
                expect(service.state).equal(ServiceState.Started)
                expect(dependency.state).equal(ServiceState.Started)
            })
            .catch((error) => {
                throw error
            })
        })

        it("should start services with dependencies correctly even if they are unordered", async () => {

            const registry = new ServiceRegistry()

            const service = new MockServiceWithDependency()
            const dependency = new MockService()

            registry
            .register(service)
            .then(() => registry.register(dependency))
            .then(() => registry.start())
            .then(() => {
                expect(service.state).equal(ServiceState.Started)
                expect(dependency.state).equal(ServiceState.Started)
            })
            .catch((error) => {
                throw error
            })
        })

        it("should throw an error when trying to start a service that is not registered", async () => {

            const registry = new ServiceRegistry()

            const service = new MockServiceWithNonExistentDependency()

            registry
            .register(service)
            .then(() => registry.start())
            .catch((error) => {
                expect(error).instanceOf(Error)
                expect(error.message).equal("Service NonExistentDependency is not registered")
            })
        })
    })

    describe("Stopping", () => {

        it("should stop the service and set the correct states", async () => {

            const registry = new ServiceRegistry()

            const service = new MockService()

            registry
            .register(service)
            .then(() => registry.start())
            .then(() => registry.stop())
            .then(() => {
                expect(service.state).equal(ServiceState.Stopped)
            })
            .catch((error) => {
                throw error
            })
        })

        it("should not error when trying to stop a service that is not started", async () => {

            const registry = new ServiceRegistry()

            const service = new MockService()

            registry
            .register(service)
            .then(() => registry.stop)
            .catch((error) => {
                throw error
            })
        })

        it("should throw an error when trying to stop a service that is not registered", async () => {

            const registry = new ServiceRegistry()

            registry
            .stopService("NonExistentService")
            .catch((error) => {
                expect(error).instanceOf(Error)
                expect(error.message).equal("Service NonExistentService is not registered")
            })
        })
    })

    describe("Reloading", () => {

        it("should reload", async () => {

            const registry = new ServiceRegistry()

            const service = new MockService()

            registry
            .register(service)
            .then(() => registry.start)
            .then(() => registry.reload)
            .then(() => {
                expect(service.state).equal(ServiceState.Started)
            })
            .catch((error) => {
                throw error
            })
        })
    })

    describe("Shutting down", () => {

        it("should shutdown the service and set the correct states", async () => {

            const registry = new ServiceRegistry()

            const service = new MockService()

            registry
            .register(service)
            .then(() => registry.start())
            .then(() => registry.shutdown())
            .then(() => {
                expect(service.state).equal(ServiceState.Stopped)
            })
        })
    })
})
