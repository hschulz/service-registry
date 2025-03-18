import { DAG } from "@hschulz/directed-acyclic-graph"
import { ServiceInterface } from "./ServiceInterface"

/**
 * The ServiceRegistry class is a singleton that manages the lifecycle of services.
 * It is responsible for registering, unregistering, starting, stopping,
 * and reloading services.
 * The ServiceRegistry class is a singleton, which means that there can only be one instance of it.
 * The instance of the ServiceRegistry class is created when the class is first used.
 */
export class ServiceRegistry {

    /**
     * The internal instance reference.
     * This instance is created when the class is first used.
     */
    protected static _instance: ServiceRegistry | undefined = undefined

    /**
     * Get public instance of the ServiceRegistry class.
     *
     * @returns The instance of the ServiceRegistry class.
     */
    public static get instance(): ServiceRegistry {

        /* Create the instance if it does not exist */
        if (!ServiceRegistry._instance) {
            ServiceRegistry._instance = new ServiceRegistry()
        }

        return ServiceRegistry._instance
    }

    protected services: Map<string, ServiceInterface> = new Map<string, ServiceInterface>()

    /**
     * Dependency tree of services.
     */
    protected dag: DAG<string> = new DAG<string>()

    /**
     * The constructor of the ServiceRegistry class.
     * If the instance already exists, it returns the existing instance.
     * If the instance does not exist, it creates a new instance.
     * This is a singleton class, so there can only be one instance of it.
     */
    public constructor() {
        if (ServiceRegistry._instance) {
            return ServiceRegistry._instance
        }

        ServiceRegistry._instance = this
    }

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
    public async startService(name: string): Promise<void> {

        /* Check if the service is registered */
        const entry = this.services.get(name)

        /* Service is unknown, so it cannot be started */
        if (!entry) {
            throw new Error(`Service ${name} is not registered`)
        }

        return new Promise<void>(async (resolve, reject) => {

            entry
            .start()
            .then(() => {
                resolve()
            })
            .catch((error) => {
                reject(error)
            })
        })
    }

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
    public async stopService(name: string): Promise<void> {

        /* Check if the service is registered */
        const entry = this.services.get(name)

        /* Service is unknown, so it cannot be stopped */
        if (!entry) {
            throw new Error(`Service ${name} is not registered`)
        }

        return new Promise<void>(async (resolve, reject) => {

            entry
            .stop()
            .then(() => {
                resolve()
            })
            .catch((error) => {
                reject(error)
            })
        })
    }

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
    public async reloadService(name: string): Promise<void> {

        /* Check if the service is registered */
        const entry = this.services.get(name)

        /* Service is unknown, so it cannot be reloaded */
        if (!entry) {
            throw new Error(`Service ${name} is not registered`)
        }

        return new Promise<void>(async (resolve, reject) => {

            /* Call the lifecycle reload method of the service */
            entry
            .reload()
            .then((results) => {

                results.forEach(result => result.status === "rejected" && reject(result.reason))
                resolve()
            })
            .catch((error) => {
                reject(error)
            })
        })
    }

    public async registerAll(services: ServiceInterface[]): Promise<void[]> {
        return Promise.all(services.map(service => this.register(service)))
    }

    /**
     * The register method registers a service with the ServiceRegistry.
     * It checks if the service is already registered.
     * If the service is already registered, it returns false.
     * If the service is not registered, it registers the service and returns true.
     *
     * @param service The service to register.
     * @returns void
     */
    public async register(service: ServiceInterface): Promise<void> {

        const name = service.constructor.name

        /* Check if the service is already registered */
        if (this.services.has(name)) {
            throw new Error(`Service ${name} is already registered`)
        }

        /* Call the lifecycle register method of the service */
        return service
        .initialize()
        .then(() => {

            this.dag.addNode(name)

            /* Add the service to the registry */
            this.services.set(name, service)

            if (service.dependencies) {

                /* Add the dependencies to the registry */
                service.dependencies.forEach((dependency) => {

                    if (!this.dag.getNode(dependency)) {
                        this.dag.addNode(dependency)
                    }

                    this.dag.addEdge(name, dependency)
                })
            }
        })
        .catch((error) => {
            throw error
        })
    }

    /**
     * The unregister method unregisters a service from the ServiceRegistry.
     * It checks if the service is already unregistered.
     * If the service is already unregistered, it returns false.
     * If the service is not unregistered, it unregisters the service and returns true.
     *
     * @param name The name of the service to unregister.
     * @returns void
     */
    public async unregister(name: string): Promise<void> {

        /* Check if the service is already unregistered */
        const entry = this.services.get(name)

        /* Service is unknown; therefore already unregistered */
        if (!entry) {
            throw new Error(`Service ${name} is not registered`)
        }

        return new Promise<void>(async (resolve, reject) => {

            entry
            .stop()
            .then(() => entry.unload())
            .then(() => {
                this.services.delete(name)
                this.dag.removeNode(name)
                resolve()
            })
            .catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * Start all services in the registry.
     *
     * @returns A promise that resolves when all services have been started.
     */
    public async start(): Promise<void[]> {
        const sortedServices = this.dag.topologicalSort().reverse()
        return Promise.all(sortedServices.map(name => this.startService(name)))
    }

    /**
     * Stop all services in the registry.
     *
     * @returns A promise that resolves when all services have been stopped.
     */
    public async stop(): Promise<void[]> {
        const sortedServices = this.dag.topologicalSort()
        return Promise.all(sortedServices.map(name => this.stopService(name)))
    }

    /**
     * Reload all services in the registry.
     *
     * @returns A promise that resolves when all services have been reloaded.
     */
    public async reload(): Promise<void[]> {
        const sortedServices = this.dag.topologicalSort()
        return Promise.all(sortedServices.map(name => this.reloadService(name)))
    }

    /**
     * Shutdown the service registry and all registered services.
     * This method stops all services and unregisters them.
     *
     * @returns A promise that resolves when all services have been stopped and unregistered.
     */
    public async shutdown(): Promise<void> {
        await this.stop()
        await Promise.all(Array.from(this.services.values()).map((entry) => entry.unload()))
    }
}
