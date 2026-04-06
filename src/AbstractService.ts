import { ServiceInterface } from "./ServiceInterface.js"
import { ServiceState } from "./ServiceState.js"

/**
 * Abstract service class.
 * This class implements the Service interface and provides
 * a default implementation for the register, unregister,
 * start, stop, and reload methods.
 */
export abstract class AbstractService implements ServiceInterface {

    /**
     * List of service dependencies.
     * This list is used to determine the order in which services
     * are started and stopped.
     */
    protected _dependencies: string[] = [
        // MyOtherService.name
    ]

    /**
     * Get the list of service dependencies.
     */
    public get dependencies(): string[] {
        return this._dependencies
    }

    /**
     * The internal reference to the current state of the service.
     * Separate getters and setters are used to access the state
     * of the service. This is to ensure that the state is only
     * modified by the service itself and not by external code.
     *
     * This was done so changes to the state of the service
     * can be paired to other events, such as logging or notifying
     * other services.
     */
    protected _state: ServiceState = ServiceState.Unknown

    /**
     * Get the current state of the service.
     */
    public get state(): ServiceState {
        return this._state
    }

    /**
     * Set the current state of the service.
     * This method is used to update the state of the service
     * during the lifecycle of the service.
     */
    protected set state(state: ServiceState) {
        this._state = state
    }

    /**
     * Register the service with the service registry.
     * This method is called when the service is registered
     * with the service registry.
     * It is used to perform any initialization that is required
     * before the service is started.
     * This method is called before the start method.
     *
     * @returns void
     */
    protected async _initialize(): Promise<void> {
        // implement me
    }

    /**
     * Unregister the service from the service registry.
     * This method is called when the service is unregistered
     * from the service registry.
     * It is used to perform any cleanup that is required
     * after the service is stopped.
     * This method is called after the stop method.
     *
     * @returns void
     */
    protected async _unload(): Promise<void> {
        // implement me
    }

    /**
     * Start the service.
     * This method is called when the service is started.
     * It is used to perform any initialization that is required
     * to start the service.
     *
     * @returns void
     */
    protected async _start(): Promise<void> {
        // implement me
    }

    /**
     * Stop the service.
     * This method is called when the service is stopped.
     * It is used to perform any cleanup that is required
     * to stop the service.
     *
     * @returns void
     */
    protected async _stop(): Promise<void> {
        // implement me
    }

    /**
     * Register the service with the service registry.
     * This method is called when the service is registered
     * with the service registry.
     * It is used to perform any initialization that is required
     * before the service is started.
     * This method is called before the start method.
     *
     * @returns void
     */
    public async initialize(): Promise<void> {

        if (this.state !== ServiceState.Unknown) {
            throw new Error(`Service ${this.constructor.name} is already initialized`)
        }

        this.state = ServiceState.Initializing

        return new Promise<void>((resolve, reject) => {
            this._initialize()
            .then(() => {
                this.state = ServiceState.Initialized
                resolve()
            })
            .catch((error) => {
                this.state = ServiceState.Error
                reject(error)
            })
        })
    }

    /**
     * Unregister the service from the service registry.
     * This method is called when the service is unregistered
     * from the service registry.
     * It is used to perform any cleanup that is required
     * after the service is stopped.
     * This method is called after the stop method.
     *
     * @returns void
     */
    public async unload(): Promise<void> {

        if (this.state !== ServiceState.Stopped) {
            throw new Error(`Service ${this.constructor.name} is not stopped`)
        }

        this.state = ServiceState.Unloading

        return new Promise<void>((resolve, reject) => {
            this._unload()
            .then(() => {
                this.state = ServiceState.Unloaded
                resolve()
            })
            .catch((error) => {
                this.state = ServiceState.Error
                reject(error)
            })
        })
    }

    /**
     * Start the service.
     * This method is called when the service is started.
     * It is used to perform any initialization that is required
     * to start the service.
     *
     * @returns void
     */
    public async start(): Promise<void> {

        switch (this.state) {
            case ServiceState.Starting:
            case ServiceState.Started:
                return
            case ServiceState.Unknown:
            case ServiceState.Stopping:
            case ServiceState.Initializing:
            case ServiceState.Unloading:
            case ServiceState.Unloaded:
                throw new Error(`Service ${this.constructor.name} can not be started in its current state: ${this.state}`)
            case ServiceState.Initialized:
            case ServiceState.Reloading:
            case ServiceState.Stopped:
            default:
                break
        }

        this.state = ServiceState.Starting

        return new Promise<void>((resolve, reject) => {

            this._start()
            .then(() => {
                this.state = ServiceState.Started
                resolve()
            })
            .catch((error) => {
                this.state = ServiceState.Error
                reject(error)
            })
        })
    }

    /**
     * Stop the service.
     * This method is called when the service is stopped.
     * It is used to perform any cleanup that is required
     * to stop the service.
     *
     * @returns void
     */
    public async stop(): Promise<void> {

        switch (this.state) {
            case ServiceState.Stopping:
            case ServiceState.Reloading:
                return
            case ServiceState.Unknown:
            case ServiceState.Initializing:
            case ServiceState.Initialized:
            case ServiceState.Starting:
            case ServiceState.Stopped:
            case ServiceState.Unloading:
            case ServiceState.Unloaded:
                throw new Error(`Service ${this.constructor.name} can not be stopped in its current state: ${this.state}`)
            case ServiceState.Started:
            default:
                break
        }

        this.state = ServiceState.Stopping

        return new Promise<void>((resolve, reject) => {

            this._stop()
            .then(() => {
                this.state = ServiceState.Stopped
                resolve()
            })
            .catch((error) => {
                this.state = ServiceState.Error
                reject(error)
            })
        })
    }

    /**
     * Reload the service.
     * This method is called when the service is reloaded.
     * It is used to perform any cleanup that is required
     * to reload the service.
     *
     * @returns The first object represents the result of the stop method.
     * The second object represents the result of the start method.
     * The promise rejects if the service cannot be reloaded.
     * The promise resolves if the service is reloaded successfully.
     */
    public async reload(): Promise<[PromiseSettledResult<void>, PromiseSettledResult<void>]> {
        this.state = ServiceState.Reloading

        return Promise.allSettled([
            this.stop(),
            this.start()
        ])
    }
}
