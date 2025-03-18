import { DAG } from "@hschulz/directed-acyclic-graph";
import { ServiceInterface } from "./ServiceInterface";
/**
 * The ServiceRegistry class is a singleton that manages the lifecycle of services.
 * It is responsible for registering, unregistering, starting, stopping,
 * and reloading services.
 * The ServiceRegistry class is a singleton, which means that there can only be one instance of it.
 * The instance of the ServiceRegistry class is created when the class is first used.
 */
export declare class ServiceRegistry {
    /**
     * The internal instance reference.
     * This instance is created when the class is first used.
     */
    protected static _instance: ServiceRegistry | undefined;
    /**
     * Get public instance of the ServiceRegistry class.
     *
     * @returns The instance of the ServiceRegistry class.
     */
    static get instance(): ServiceRegistry;
    protected services: Map<string, ServiceInterface>;
    /**
     * Dependency tree of services.
     */
    protected dag: DAG<string>;
    /**
     * The constructor of the ServiceRegistry class.
     * If the instance already exists, it returns the existing instance.
     * If the instance does not exist, it creates a new instance.
     * This is a singleton class, so there can only be one instance of it.
     */
    constructor();
    /**
     * The startService method starts a service.
     * It checks if the service is already started.
     * If the service is already started, it returns true.
     * If the service is not started, it starts the service and returns true.
     * If the service does not exist, it returns false.
     *
     * @param name The name of the service to start.
     * @returns void
     */
    startService(name: string): Promise<void>;
    /**
     * The stopService method stops a service.
     * It checks if the service is already stopped.
     * If the service is already stopped, it returns true.
     * If the service is not stopped, it stops the service and returns true.
     * If the service does not exist, it returns false.
     *
     * @param name The name of the service to stop.
     * @returns void
     */
    stopService(name: string): Promise<void>;
    /**
     * The reloadService method reloads a service.
     * It checks if the service is already stopped.
     * If the service is already stopped, it returns false.
     * If the service is not stopped, it reloads the service and returns true.
     * If the service does not exist, it returns false.
     *
     * @param name The name of the service to reload.
     * @returns void
     */
    reloadService(name: string): Promise<void>;
    registerAll(services: ServiceInterface[]): Promise<void[]>;
    /**
     * The register method registers a service with the ServiceRegistry.
     * It checks if the service is already registered.
     * If the service is already registered, it returns false.
     * If the service is not registered, it registers the service and returns true.
     *
     * @param service The service to register.
     * @returns void
     */
    register(service: ServiceInterface): Promise<void>;
    /**
     * The unregister method unregisters a service from the ServiceRegistry.
     * It checks if the service is already unregistered.
     * If the service is already unregistered, it returns false.
     * If the service is not unregistered, it unregisters the service and returns true.
     *
     * @param name The name of the service to unregister.
     * @returns void
     */
    unregister(name: string): Promise<void>;
    /**
     * Start all services in the registry.
     *
     * @returns A promise that resolves when all services have been started.
     */
    start(): Promise<void[]>;
    /**
     * Stop all services in the registry.
     *
     * @returns A promise that resolves when all services have been stopped.
     */
    stop(): Promise<void[]>;
    /**
     * Reload all services in the registry.
     *
     * @returns A promise that resolves when all services have been reloaded.
     */
    reload(): Promise<void[]>;
    /**
     * Shutdown the service registry and all registered services.
     * This method stops all services and unregisters them.
     *
     * @returns A promise that resolves when all services have been stopped and unregistered.
     */
    shutdown(): Promise<void>;
}
//# sourceMappingURL=ServiceRegistry.d.ts.map