import { describe, it, expect } from "vitest"
import { AbstractService, ServiceState } from "../src/index.js"

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

class MockServiceWithSettableState extends AbstractService {

    public setState(state: ServiceState) {
        this._state = state
    }
}

describe("Service Suite", () => {

    describe("Basic functionality", () => {

        it("should create an instance of MockService", () => {
            const service = new MockService()
            expect(service).toBeInstanceOf(MockService)
        })

        it("should have an empty dependencies array", () => {
            const service = new MockService()
            expect(service.dependencies).toBeInstanceOf(Array)
            expect(service.dependencies).toHaveLength(0)
        })

        it("should have an initial state of ServiceState.Unknown", () => {
            const service = new MockService()
            expect(service.state).toBe(ServiceState.Unknown)
        })
    })

    describe("Initialization", () => {

        it("should be able to register and set the status to ServiceState.Initialized", async () => {

            const service = new MockService()

            await service.initialize()
            expect(service.state).toBe(ServiceState.Initialized)
        })

        it("should throw an error when initializing an already initialized service", async () => {

            const service = new MockService()

            await service.initialize()
            await expect(service.initialize()).rejects.toThrow("Service MockService is already initialized")
            expect(service.state).toBe(ServiceState.Initialized)
        })

        it("should throw an error when registering a service that errors in _initialize", async () => {
            const service = new ErroringInInitializeService()

            await expect(service.initialize()).rejects.toThrow("Error in _initialize")
            expect(service.state).toBe(ServiceState.Error)
        })
    })

    describe("Starting", () => {

        it("should be able to start and set the status to ServiceState.Started", async () => {

            const service = new MockService()

            await service.initialize()
            await service.start()
            expect(service.state).toBe(ServiceState.Started)
        })

        it("should throw an error when starting an already started service", async () => {

            const service = new MockService()

            await service.initialize()
            await service.start()
            // Starting an already started service returns without error (early return in switch)
            await service.start()
            expect(service.state).toBe(ServiceState.Started)
        })

        it("should throw an error when starting a service that errors in _start", async () => {
            const service = new ErroringInStartService()

            await service.initialize()
            await expect(service.start()).rejects.toThrow("Error in _start")
            expect(service.state).toBe(ServiceState.Error)
        })

        it("should ignore the start when the state is ServiceState.Starting", async () => {

            const service = new MockServiceWithSettableState()
            service.setState(ServiceState.Starting)

            await service.start()
            expect(service.state).toBe(ServiceState.Starting)
        })

        it("should throw an error when calling start and the current state is ServiceState.Unknown", async () => {

            const service = new MockServiceWithSettableState()

            await expect(service.start()).rejects.toThrow(
                "Service MockServiceWithSettableState can not be started in its current state: unknown"
            )
        })
    })

    describe("Stopping", () => {

        it("should be able to stop and set the status to ServiceState.Stopped", async () => {

            const service = new MockService()

            expect(service.state).toBe(ServiceState.Unknown)

            await service.initialize()
            await service.start()
            await service.stop()
            expect(service.state).toBe(ServiceState.Stopped)
        })

        it("should throw an error when stopping a service that is not started", async () => {

            const service = new MockService()

            await service.initialize()
            await expect(service.stop()).rejects.toThrow()
            expect(service.state).toBe(ServiceState.Initialized)
        })

        it("should throw an error when stopping a service that errors in _stop", async () => {
            const service = new ErroringInStopService()

            await service.initialize()
            await service.start()
            await expect(service.stop()).rejects.toThrow("Error in _stop")
            expect(service.state).toBe(ServiceState.Error)
        })

        it("should ignore the stop when the state is ServiceState.Stopping", async () => {

            const service = new MockServiceWithSettableState()
            service.setState(ServiceState.Stopping)

            await service.stop()
            expect(service.state).toBe(ServiceState.Stopping)
        })

        it("should throw an error when calling stop and the current state is ServiceState.Unknown", async () => {

            const service = new MockServiceWithSettableState()

            await expect(service.stop()).rejects.toThrow(
                "Service MockServiceWithSettableState can not be stopped in its current state: unknown"
            )
        })
    })

    describe("Unloading", () => {

        it("should be able to unload and set the status to ServiceState.Unloaded", async () => {

            const service = new MockService()

            await service.initialize()
            await service.start()
            await service.stop()
            await service.unload()
            expect(service.state).toBe(ServiceState.Unloaded)
        })

        it("should throw an error when unloading a service that is not stopped", async () => {

            const service = new MockService()

            await service.initialize()
            await service.start()
            await expect(service.unload()).rejects.toThrow("Service MockService is not stopped")
            expect(service.state).toBe(ServiceState.Started)
        })

        it("should throw an error when unloading a service that is not initialized", async () => {

            const service = new MockService()

            await expect(service.unload()).rejects.toThrow("Service MockService is not stopped")
            expect(service.state).toBe(ServiceState.Unknown)
        })

        it("should throw an error when unloading a service that errors in _unload", async () => {
            const service = new ErroringInUnloadService()

            await service.initialize()
            await service.start()
            await service.stop()
            await expect(service.unload()).rejects.toThrow("Error in _unload")
            expect(service.state).toBe(ServiceState.Error)
        })
    })

    describe("Reloading", () => {

        it("should reload the service", async () => {

            const service = new MockService()

            await service.initialize()
            await service.start()
            await service.reload()
            expect(service.state).toBe(ServiceState.Started)
        })
    })
})
