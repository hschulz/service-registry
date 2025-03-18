/**
 * This enum represents the different states a service can be in.
 * The states are used to indicate the current state of the service
 * and to determine the order in which services are started and stopped.
 */
export enum ServiceState {

    /**
     * The unknown state is used when the service state is not known.
     * This can happen when the service is not started or has not
     * been registered yet.
     */
    Unknown = "unknown",

    /**
     * This state is used when the service is being registered.
     * This can happen when the service is not started and
     * has started registering.
     */
    Initializing = "initializing",

    /**
     * This state is used when the service is registered.
     * This can happen when the service is not started but has been
     * registered.
     */
    Initialized = "initialized",

    /**
     * This state is used when the service is being unregistered.
     * This can happen when the service is being unregistered.
     */
    Unloading = "unloading",

    /**
     * This state is used when the service is unregistered.
     * This can happen when the service is not started and
     * has been unregistered.
     */
    Unloaded = "unloaded",

    /**
     * This state is used when the service is starting.
     */
    Starting = "starting",

    /**
     * This state is used when the service is started and running.
     */
    Started = "started",

    /**
     * This state is used when the service is stopping.
     */
    Stopping = "stopping",

    /**
     * This state is used when the service is stopped and not running.
     */
    Stopped = "stopped",

    /**
     * This state is used when the service is reloading.
     */
    Reloading = "reloading",

    /**
     * This state is used when the service is in an error state.
     * This can happen when the service fails to start or stop.
     * It can also happen when the service is in an unknown state
     * and the service is not started or has not been registered yet.
     * This state is used to indicate that the service is not in a
     * valid state and should not be used.
     */
    Error = "error"
}
