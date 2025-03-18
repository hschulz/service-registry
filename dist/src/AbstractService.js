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
exports.AbstractService = void 0;
const ServiceState_1 = require("./ServiceState");
/**
 * Abstract service class.
 * This class implements the Service interface and provides
 * a default implementation for the register, unregister,
 * start, stop, and reload methods.
 */
class AbstractService {
    constructor() {
        /**
         * List of service dependencies.
         * This list is used to determine the order in which services
         * are started and stopped.
         */
        this._dependencies = [
        // MyOtherService.name
        ];
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
        this._state = ServiceState_1.ServiceState.Unknown;
    }
    /**
     * Get the list of service dependencies.
     */
    get dependencies() {
        return this._dependencies;
    }
    /**
     * Get the current state of the service.
     */
    get state() {
        return this._state;
    }
    /**
     * Set the current state of the service.
     * This method is used to update the state of the service
     * during the lifecycle of the service.
     */
    set state(state) {
        this._state = state;
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
    _initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            // implement me
        });
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
    _unload() {
        return __awaiter(this, void 0, void 0, function* () {
            // implement me
        });
    }
    /**
     * Start the service.
     * This method is called when the service is started.
     * It is used to perform any initialization that is required
     * to start the service.
     *
     * @returns void
     */
    _start() {
        return __awaiter(this, void 0, void 0, function* () {
            // implement me
        });
    }
    /**
     * Stop the service.
     * This method is called when the service is stopped.
     * It is used to perform any cleanup that is required
     * to stop the service.
     *
     * @returns void
     */
    _stop() {
        return __awaiter(this, void 0, void 0, function* () {
            // implement me
        });
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
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state !== ServiceState_1.ServiceState.Unknown) {
                throw new Error(`Service ${this.constructor.name} is already initialized`);
            }
            this.state = ServiceState_1.ServiceState.Initializing;
            return new Promise((resolve, reject) => {
                this._initialize()
                    .then(() => {
                    this.state = ServiceState_1.ServiceState.Initialized;
                    resolve();
                })
                    .catch((error) => {
                    this.state = ServiceState_1.ServiceState.Error;
                    reject(error);
                });
            });
        });
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
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state !== ServiceState_1.ServiceState.Stopped) {
                throw new Error(`Service ${this.constructor.name} is not stopped`);
            }
            this.state = ServiceState_1.ServiceState.Unloading;
            return new Promise((resolve, reject) => {
                this._unload()
                    .then(() => {
                    this.state = ServiceState_1.ServiceState.Unloaded;
                    resolve();
                })
                    .catch((error) => {
                    this.state = ServiceState_1.ServiceState.Error;
                    reject(error);
                });
            });
        });
    }
    /**
     * Start the service.
     * This method is called when the service is started.
     * It is used to perform any initialization that is required
     * to start the service.
     *
     * @returns void
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.state) {
                case ServiceState_1.ServiceState.Starting:
                case ServiceState_1.ServiceState.Started:
                    return;
                case ServiceState_1.ServiceState.Unknown:
                case ServiceState_1.ServiceState.Stopping:
                case ServiceState_1.ServiceState.Initializing:
                case ServiceState_1.ServiceState.Unloading:
                case ServiceState_1.ServiceState.Unloaded:
                    throw new Error(`Service ${this.constructor.name} can not be started in its current state: ${this.state}`);
                case ServiceState_1.ServiceState.Initialized:
                case ServiceState_1.ServiceState.Reloading:
                case ServiceState_1.ServiceState.Stopped:
                default:
                    break;
            }
            this.state = ServiceState_1.ServiceState.Starting;
            return new Promise((resolve, reject) => {
                this._start()
                    .then(() => {
                    this.state = ServiceState_1.ServiceState.Started;
                    resolve();
                })
                    .catch((error) => {
                    this.state = ServiceState_1.ServiceState.Error;
                    reject(error);
                });
            });
        });
    }
    /**
     * Stop the service.
     * This method is called when the service is stopped.
     * It is used to perform any cleanup that is required
     * to stop the service.
     *
     * @returns void
     */
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.state) {
                case ServiceState_1.ServiceState.Stopping:
                case ServiceState_1.ServiceState.Reloading:
                    return;
                case ServiceState_1.ServiceState.Unknown:
                case ServiceState_1.ServiceState.Initializing:
                case ServiceState_1.ServiceState.Initialized:
                case ServiceState_1.ServiceState.Starting:
                case ServiceState_1.ServiceState.Stopped:
                case ServiceState_1.ServiceState.Unloading:
                case ServiceState_1.ServiceState.Unloaded:
                    throw new Error(`Service ${this.constructor.name} can not be stopped in its current state: ${this.state}`);
                case ServiceState_1.ServiceState.Started:
                default:
                    break;
            }
            this.state = ServiceState_1.ServiceState.Stopping;
            return new Promise((resolve, reject) => {
                this._stop()
                    .then(() => {
                    this.state = ServiceState_1.ServiceState.Stopped;
                    resolve();
                })
                    .catch((error) => {
                    this.state = ServiceState_1.ServiceState.Error;
                    reject(error);
                });
            });
        });
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
    reload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.state = ServiceState_1.ServiceState.Reloading;
            return Promise.allSettled([
                this.stop(),
                this.start()
            ]);
        });
    }
}
exports.AbstractService = AbstractService;
//# sourceMappingURL=AbstractService.js.map