"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceState = void 0;
/**
 * This enum represents the different states a service can be in.
 * The states are used to indicate the current state of the service
 * and to determine the order in which services are started and stopped.
 */
var ServiceState;
(function (ServiceState) {
    /**
     * The unknown state is used when the service state is not known.
     * This can happen when the service is not started or has not
     * been registered yet.
     */
    ServiceState["Unknown"] = "unknown";
    /**
     * This state is used when the service is being registered.
     * This can happen when the service is not started and
     * has started registering.
     */
    ServiceState["Initializing"] = "initializing";
    /**
     * This state is used when the service is registered.
     * This can happen when the service is not started but has been
     * registered.
     */
    ServiceState["Initialized"] = "initialized";
    /**
     * This state is used when the service is being unregistered.
     * This can happen when the service is being unregistered.
     */
    ServiceState["Unloading"] = "unloading";
    /**
     * This state is used when the service is unregistered.
     * This can happen when the service is not started and
     * has been unregistered.
     */
    ServiceState["Unloaded"] = "unloaded";
    /**
     * This state is used when the service is starting.
     */
    ServiceState["Starting"] = "starting";
    /**
     * This state is used when the service is started and running.
     */
    ServiceState["Started"] = "started";
    /**
     * This state is used when the service is stopping.
     */
    ServiceState["Stopping"] = "stopping";
    /**
     * This state is used when the service is stopped and not running.
     */
    ServiceState["Stopped"] = "stopped";
    /**
     * This state is used when the service is reloading.
     */
    ServiceState["Reloading"] = "reloading";
    /**
     * This state is used when the service is in an error state.
     * This can happen when the service fails to start or stop.
     * It can also happen when the service is in an unknown state
     * and the service is not started or has not been registered yet.
     * This state is used to indicate that the service is not in a
     * valid state and should not be used.
     */
    ServiceState["Error"] = "error";
})(ServiceState || (exports.ServiceState = ServiceState = {}));
//# sourceMappingURL=ServiceState.js.map