import { ServiceInterface } from "./ServiceInterface";
import { ServiceState } from "./ServiceState";
/**
 * Abstract service class.
 * This class implements the Service interface and provides
 * a default implementation for the register, unregister,
 * start, stop, and reload methods.
 */
export declare abstract class AbstractService implements ServiceInterface {
    /**
     * List of service dependencies.
     * This list is used to determine the order in which services
     * are started and stopped.
     */
    protected _dependencies: string[];
    /**
     * Get the list of service dependencies.
     */
    get dependencies(): string[];
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
    protected _state: ServiceState;
    /**
     * Get the current state of the service.
     */
    get state(): ServiceState;
    /**
     * Set the current state of the service.
     * This method is used to update the state of the service
     * during the lifecycle of the service.
     */
    protected set state(state: ServiceState);
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
    protected _initialize(): Promise<void>;
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
    protected _unload(): Promise<void>;
    /**
     * Start the service.
     * This method is called when the service is started.
     * It is used to perform any initialization that is required
     * to start the service.
     *
     * @returns void
     */
    protected _start(): Promise<void>;
    /**
     * Stop the service.
     * This method is called when the service is stopped.
     * It is used to perform any cleanup that is required
     * to stop the service.
     *
     * @returns void
     */
    protected _stop(): Promise<void>;
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
    initialize(): Promise<void>;
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
    unload(): Promise<void>;
    /**
     * Start the service.
     * This method is called when the service is started.
     * It is used to perform any initialization that is required
     * to start the service.
     *
     * @returns void
     */
    start(): Promise<void>;
    /**
     * Stop the service.
     * This method is called when the service is stopped.
     * It is used to perform any cleanup that is required
     * to stop the service.
     *
     * @returns void
     */
    stop(): Promise<void>;
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
    reload(): Promise<[PromiseSettledResult<void>, PromiseSettledResult<void>]>;
}
//# sourceMappingURL=AbstractService.d.ts.map