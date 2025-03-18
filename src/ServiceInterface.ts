import { ServiceState } from "./ServiceState"

/**
 * This is the interface for the service.
 * It defines the methods that must be implemented by
 * any service that is registered with the service registry.
 */
export interface ServiceInterface {

    /**
     * The current state of the service.
     */
    get state(): ServiceState

    /**
     * The list of service dependencies.
     * This is used to determine the order in which services
     * are started and stopped.
     */
    get dependencies(): string[]

    /**
     * This method is called when the service is registered
     * with the service registry.
     * It is used to perform any initialization that is required
     * before the service is started.
     * This method is called before the start method.
     *
     * @returns void
     */
    initialize(): Promise<void>

    /**
     * This method is called when the service is unregistered
     * from the service registry.
     * It is used to perform any cleanup that is required
     * after the service is stopped.
     * This method is called after the stop method.
     *
     * @returns void
     */
    unload(): Promise<void>

    /**
     * This method is called when the service is started.
     * It is used to perform any initialization that is required
     * to start the service.
     *
     * @returns void
     */
    start(): Promise<void>

    /**
     * This method is called when the service is stopped.
     * It is used to perform any cleanup that is required
     * to stop the service.
     *
     * @returns void
     */
    stop(): Promise<void>

    /**
     * This method is called when the service is reloaded.
     * It is used to perform any initialization that is required
     * to reload the service.
     *
     * @returns void
     */
    reload(): Promise<[PromiseSettledResult<void>, PromiseSettledResult<void>]>
}
