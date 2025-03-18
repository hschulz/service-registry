"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRegistry = void 0;
const directed_acyclic_graph_1 = require("@hschulz/directed-acyclic-graph");
/**
 * The ServiceRegistry class is a singleton that manages the lifecycle of services.
 * It is responsible for registering, unregistering, starting, stopping,
 * and reloading services.
 * The ServiceRegistry class is a singleton, which means that there can only be one instance of it.
 * The instance of the ServiceRegistry class is created when the class is first used.
 */
class ServiceRegistry {
    /**
     * Get public instance of the ServiceRegistry class.
     *
     * @returns The instance of the ServiceRegistry class.
     */
    static get instance() {
        /* Create the instance if it does not exist */
        if (!ServiceRegistry._instance) {
            ServiceRegistry._instance = new ServiceRegistry();
        }
        return ServiceRegistry._instance;
    }
    /**
     * The constructor of the ServiceRegistry class.
     * If the instance already exists, it returns the existing instance.
     * If the instance does not exist, it creates a new instance.
     * This is a singleton class, so there can only be one instance of it.
     */
    constructor() {
        this.services = new Map();
        /**
         * Dependency tree of services.
         */
        this.dag = new directed_acyclic_graph_1.DAG();
        if (ServiceRegistry._instance) {
            return ServiceRegistry._instance;
        }
        ServiceRegistry._instance = this;
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
    startService(name) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Check if the service is registered */
            const entry = this.services.get(name);
            /* Service is unknown, so it cannot be started */
            if (!entry) {
                throw new Error(`Service ${name} is not registered`);
            }
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                entry
                    .start()
                    .then(() => {
                    resolve();
                })
                    .catch((error) => {
                    reject(error);
                });
            }));
        });
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
    stopService(name) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Check if the service is registered */
            const entry = this.services.get(name);
            /* Service is unknown, so it cannot be stopped */
            if (!entry) {
                throw new Error(`Service ${name} is not registered`);
            }
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                entry
                    .stop()
                    .then(() => {
                    resolve();
                })
                    .catch((error) => {
                    reject(error);
                });
            }));
        });
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
    reloadService(name) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Check if the service is registered */
            const entry = this.services.get(name);
            /* Service is unknown, so it cannot be reloaded */
            if (!entry) {
                throw new Error(`Service ${name} is not registered`);
            }
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                /* Call the lifecycle reload method of the service */
                entry
                    .reload()
                    .then((results) => {
                    results.forEach(result => result.status === "rejected" && reject(result.reason));
                    resolve();
                })
                    .catch((error) => {
                    reject(error);
                });
            }));
        });
    }
    registerAll(services) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(services.map(service => this.register(service)));
        });
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
    register(service) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = service.constructor.name;
            /* Check if the service is already registered */
            if (this.services.has(name)) {
                throw new Error(`Service ${name} is already registered`);
            }
            /* Call the lifecycle register method of the service */
            return service
                .initialize()
                .then(() => {
                this.dag.addNode(name);
                /* Add the service to the registry */
                this.services.set(name, service);
                if (service.dependencies) {
                    /* Add the dependencies to the registry */
                    service.dependencies.forEach((dependency) => {
                        if (!this.dag.getNode(dependency)) {
                            this.dag.addNode(dependency);
                        }
                        this.dag.addEdge(name, dependency);
                    });
                }
            })
                .catch((error) => {
                throw error;
            });
        });
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
    unregister(name) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Check if the service is already unregistered */
            const entry = this.services.get(name);
            /* Service is unknown; therefore already unregistered */
            if (!entry) {
                throw new Error(`Service ${name} is not registered`);
            }
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                entry
                    .stop()
                    .then(() => entry.unload())
                    .then(() => {
                    this.services.delete(name);
                    this.dag.removeNode(name);
                    resolve();
                })
                    .catch((error) => {
                    reject(error);
                });
            }));
        });
    }
    /**
     * Start all services in the registry.
     *
     * @returns A promise that resolves when all services have been started.
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const sortedServices = this.dag.topologicalSort().reverse();
            return Promise.all(sortedServices.map(name => this.startService(name)));
        });
    }
    /**
     * Stop all services in the registry.
     *
     * @returns A promise that resolves when all services have been stopped.
     */
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            const sortedServices = this.dag.topologicalSort();
            return Promise.all(sortedServices.map(name => this.stopService(name)));
        });
    }
    /**
     * Reload all services in the registry.
     *
     * @returns A promise that resolves when all services have been reloaded.
     */
    reload() {
        return __awaiter(this, void 0, void 0, function* () {
            const sortedServices = this.dag.topologicalSort();
            return Promise.all(sortedServices.map(name => this.reloadService(name)));
        });
    }
    /**
     * Shutdown the service registry and all registered services.
     * This method stops all services and unregisters them.
     *
     * @returns A promise that resolves when all services have been stopped and unregistered.
     */
    shutdown() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.stop();
            yield Promise.all(Array.from(this.services.values()).map((entry) => entry.unload()));
        });
    }
}
exports.ServiceRegistry = ServiceRegistry;
/**
 * The internal instance reference.
 * This instance is created when the class is first used.
 */
ServiceRegistry._instance = undefined;
//# sourceMappingURL=ServiceRegistry.js.map