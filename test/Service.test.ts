import { expect } from "chai"
import { AbstractService, ServiceState } from ".."

class MockService extends AbstractService {}

class ErroringInInitializeService extends AbstractService {

    protected override async _initialize(): Promise<void> {
        throw new Error("Error in _initialize")
    }
}

class ErroringInStartService extends AbstractService {

    protected override async _start(): Promise<void> {
        throw new Error("Error in _start")
    }
}

class ErroringInStopService extends AbstractService {

    protected override async _stop(): Promise<void> {
        throw new Error("Error in _stop")
    }
}

class ErroringInUnloadService extends AbstractService {

    protected override async _unload(): Promise<void> {
        throw new Error("Error in _unload")
    }
}

class MoockServiceWithSettableState extends AbstractService {

    public setState(state: ServiceState) {
        this._state = state
    }
}

describe("Service Suite", () => {

    describe("Basic functionality", () => {

        it("should create an instance of MockService", () => {
            const service = new MockService()
            expect(service).instanceOf(MockService)
        })

        it("should have an empty dependencies array", () => {
            const service = new MockService()
            expect(service.dependencies).instanceOf(Array)
            expect(service.dependencies).length(0)
        })

        it("should have an initial state of ServiceState.Unknown", () => {
            const service = new MockService()
            expect(service.state).equal(ServiceState.Unknown)
        })
    })

    describe("Initialization", () => {

        it("should be able to register and set the status to ServiceState.Initialized", async () => {

            const service = new MockService()

            service
            .initialize()
            .then(() => {
                expect(service.state).equal(ServiceState.Initialized)
            })
            .catch((error) => {
                throw error
            })
        })

        it("should throw an error when initializing an already initialized service", async () => {

            const service = new MockService()

            service
            .initialize()
            .then(() => service.initialize())
            .catch((error) => {
                expect(error.message).equal("Service MockService is already initialized")
            })
            .finally(() => {
                expect(service.state).equal(ServiceState.Initialized)
            })
        })

        it("should throw an error when registering a service that errors in _initialize", async () => {
            const service = new ErroringInInitializeService()

            service
            .initialize()
            .then(() => {
                throw new Error("Service should not have initialized")
            })
            .catch((error) => {
                expect(error.message).equal("Error in _initialize")
            })
            .finally(() => {
                expect(service.state).equal(ServiceState.Error)
            })
        })
    })

    describe("Starting", () => {

        it("should be able to start and set the status to ServiceState.Started", async () => {

            const service = new MockService()

            service
            .initialize()
            .then(() => service.start())
            .then(() => {
                expect(service.state).equal(ServiceState.Started)
            })
            .catch((error) => {
                throw error
            })
        })

        it("should throw an error when starting an already started service", async () => {

            const service = new MockService()

            service
            .initialize()
            .then(() => service.start())
            .then(() => service.start())
            .catch((error) => {
                expect(error.message).equal("Service MockService is not initialized")
            })
            .finally(() => {
                expect(service.state).equal(ServiceState.Started)
            })
        })

        it("should throw an error when starting a service that errors in _start", async () => {
            const service = new ErroringInStartService()

            service
            .initialize()
            .then(() => service.start())
            .catch((error) => {
                expect(error.message).equal("Error in _start")
            })
            .finally(() => {
                expect(service.state).equal(ServiceState.Error)
            })
        })

        it("should ignore the start when the state is ServiceState.Starting", async () => {

            const service = new MoockServiceWithSettableState()
            service.setState(ServiceState.Starting)

            service.start()
            .then(() => {
                expect(service.state).equal(ServiceState.Starting)
            })
            .catch((error) => {
                throw error
            })
        })

        it("should throw an error when calling start and the current state is ServiceState.Unknown", async () => {

            const service = new MoockServiceWithSettableState()

            service
            .start()
            .catch((error) => {
                expect(error.message).equal("Service MoockServiceWithSettableState can not be started in its current state: unknown")
            })
        })
    })

    describe("Stopping", () => {

        it("should be able to stop and set the status to ServiceState.Stopped", async () => {

            const service = new MockService()

            expect(service.state).equal(ServiceState.Unknown)

            service
            .initialize()
            .then(() => service.start())
            .then(() => service.stop())
            .then(() => {
                expect(service.state).equal(ServiceState.Stopped)
            })
            .catch((error) => {
                throw error
            })
        })

        it("should throw an error when stopping a service that is not started", async () => {

            const service = new MockService()

            service
            .initialize()
            .then(() => service.stop())
            .catch((error) => {
                expect(error.message).equal("Service MockService is not initialized")
            })
            .finally(() => {
                expect(service.state).equal(ServiceState.Initialized)
            })
        })

        it("should throw an error when stopping a service that errors in _stop", async () => {
            const service = new ErroringInStopService()

            service
            .initialize()
            .then(() => service.start())
            .then(() => service.stop())
            .catch((error) => {
                expect(error.message).equal("Error in _stop")
            })
            .finally(() => {
                expect(service.state).equal(ServiceState.Error)
            })
        })

        it("should ignore the stop when the state is ServiceState.Stopping", async () => {

            const service = new MoockServiceWithSettableState()
            service.setState(ServiceState.Stopping)

            service
            .stop()
            .then(() => {
                expect(service.state).equal(ServiceState.Stopping)
            })
            .catch((error) => {
                throw error
            })
        })

        it("should throw an error when calling stop and the current state is ServiceState.Unknown", async () => {

            const service = new MoockServiceWithSettableState()

            service
            .stop()
            .catch((error) => {
                expect(error.message).equal("Service MoockServiceWithSettableState can not be stopped in its current state: unknown")
            })
        })
    })

    describe("Unloading", () => {

        it("should be able to unload and set the status to ServiceState.Unloaded", async () => {

            const service = new MockService()

            service
            .initialize()
            .then(() => service.start())
            .then(() => service.stop())
            .then(() => service.unload())
            .then(() => {
                expect(service.state).equal(ServiceState.Unloaded)
            })
            .catch((error) => {
                // fail(`Service failed to unload: ${error}`)
                throw error
            })
        })

        it("should throw an error when unloading a service that is not stopped", async () => {

            const service = new MockService()

            service
            .initialize()
            .then(() => service.start())
            .then(() => service.unload())
            .catch((error) => {
                expect(error.message).equal("Service MockService is not stopped")
            })
            .finally(() => {
                expect(service.state).equal(ServiceState.Started)
            })
        })

        it("should throw an error when unloading a service that is not initialized", async () => {

            const service = new MockService()

            service
            .unload()
            .catch((error) => {
                expect(error.message).equal("Service MockService is not initialized")
            })
            .finally(() => {
                expect(service.state).equal(ServiceState.Unknown)
            })
        })

        it("should throw an error when unloading a service that errors in _unload", async () => {
            const service = new ErroringInUnloadService()

            service
            .initialize()
            .then(() => service.start())
            .then(() => service.stop())
            .then(() => service.unload())
            .catch((error) => {
                expect(error.message).equal("Error in _unload")
            })
            .finally(() => {
                expect(service.state).equal(ServiceState.Error)
            })
        })
    })

    describe("Reloading", () => {

        it("should reload the service", async () => {

            const service = new MockService()

            service
            .initialize()
            .then(() => service.start)
            .then(() => service.reload)
            .then(() => {
                expect(service.state).equal(ServiceState.Started)
            })
            .catch((error) => {
                throw error
            })
        })
    })
})
