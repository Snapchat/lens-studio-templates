//-----------------------------------------
// StateMachine.js     
//-----------------------------------------
// Version: 0.0.3
// Event: Initialized

// Example:

// var stateMachine = new global.StateMachine( "Machine" );

// stateMachine.addState(
//     {
//         name: "Idle",            // The name of this state
//         onEnter: idleEnter,        // Callback on state enter
//         onUpdate: idleUpdate,    // Callback on state update
//         onExit: idleExit,        // Callback on state exit
//         transitions: [          // Configs for transitions to other states
//             {
//                 nextStateName: "active", // State name to transition to
//                 checkOnUpdate: checkTransitionToActive, // Function called each frame that returns whether the transition should occur
//                 checkOnSignal: checkIdleSignal, // Function called when the machine receives a signal that returns whether the transition should occur
//             },
//         ],
//         onSignal: { // Dictionary of signal responses
//            "screenTapped": onIdleScreenTapped, // Function to call when this signal is received
//         }
//     }
// ); 

// stateMachine.enterState( "Idle" );

global.StateTransition = function(state, config) {
    this.state = state;
    this.nextStateName = config.nextStateName;
    this.checkOnUpdate = config.checkOnUpdate;
    this.checkOnSignal = config.checkOnSignal;
    this.onEnter = config.onEnter;
    this.data = config.data || {};
};

global.State = function(machine, config) {
    this.machine = machine;

    if (this.machine == null) {
        return;
    }

    this.name = (config.name == null || config.name === "") ? "NewState" : config.name.toString();
    this.onEnter = config.onEnter;
    this.onExit = config.onExit;
    this.onUpdate = config.onUpdate;
    this.onLateUpdate = config.onLateUpdate;
    this.onSignal = config.onSignal || {};
    this.data = config.data || {};
    this.printDebug = false;

    this.stateTime = 0;

    this.stateElapsedTime = 0;

    this.canExit = false;
    
    this.updateTransitions = [];
    this.signalTransitions = [];

    if (config.transitions) {
        for (var i=0; i<config.transitions.length; i++) {
            this.addTransitionConfig(config.transitions[i]);
        }
    }
};

global.State.prototype = {
    // For backwards compatibility
    get stateTime() { 
        return this.stateElapsedTime;
    },
    get stateCount() {
        return Object.keys(this.states).length;
    },

    addTransitionConfig: function(config) {
        var transitionObj = new global.StateTransition(this, config);
        if (transitionObj.checkOnUpdate) {
            this.updateTransitions.push(transitionObj);
        }
        if (transitionObj.checkOnSignal) {
            this.signalTransitions.push(transitionObj);
        }
    },

    // Transition helpers
    addUpdateTransition: function(nextStateName, updateCheck, config) {
        config = config || {};
        config.nextStateName = nextStateName;
        config.checkOnUpdate = updateCheck;
        this.addTransitionConfig(config);
    },

    addTimedTransition: function(nextStateName, timeDelay, config) {
        config = config || {};
        this.addUpdateTransition(nextStateName, function() {
            return this.state.stateElapsedTime >= timeDelay;
        }, config);
    },

    addSignalTransition: function(nextStateName, signalCheck, config) {
        config = config || {};
        config.nextStateName = nextStateName;
        config.checkOnSignal = signalCheck;
        this.addTransitionConfig(config);
    },

    addSimpleSignalTransition: function(nextStateName, signalString, config) {
        config = config || {};
        this.addSignalTransition(nextStateName, function(s, d) {
            return s === signalString;
        }, config);
    },
};

global.StateMachine = function(name, scriptComponent) {
    this.name = (name == null || name === "") ? "NewStateMachine" : name.toString();
    this.currentState = null;
    this.states = {};
    this.stateCount = 0;
    this.onUpdateAll;
    this.onLateUpdateAll;
    this.onStateChanged;

    scriptComponent.createEvent("UpdateEvent").bind(this.update.bind(this));
    scriptComponent.createEvent("LateUpdateEvent").bind(this.lateUpdate.bind(this));
};

global.StateMachine.prototype.addState = function(config) {
    var newState = new global.State(this, config);

    this.states[newState.name] = newState;
    this.stateCount++;
    return newState;
};

global.StateMachine.prototype.enterState = function(stateName) {
    if (this.states[stateName] == null) {
        print("[STATE]: Invalid state name: " + stateName);
        return;
    }

    var oldStateName = (this.currentState ? this.currentState.name : null);

    if (this.currentState != null) {
        this.exitState();
    }

    this.currentState = this.states[stateName];

    if (this.printDebug) {
        print("[STATE]: Entering State: " + this.currentState.name);
    }

    this.currentState.stateTime = 0;
    this.currentState.stateStartTime = global.getTime();

    if (this.currentState.onEnter != null) {
        this.currentState.onEnter(this.currentState);        
    }

    if (this.onStateChanged != null) {
        this.onStateChanged(this.currentState.name, oldStateName);
    }
};

global.StateMachine.prototype.exitState = function() {
    if (this.currentState == null) {
        return;
    }

    if (this.currentState.onExit != null) {
        this.currentState.onExit(this.currentState);
    }
};

global.StateMachine.prototype.executeTransition = function(transition) {
    if (transition.onEnter) {
        transition.onEnter();
    }

    if (transition.nextStateName) {
        this.enterState(transition.nextStateName);
    }
};

global.StateMachine.prototype.sendSignal = function(signal, data) {
    if (!this.currentState) {
        return;
    }

    var stateName = this.currentState.name;
    if (this.currentState.onSignal) {
        // this.currentState.onSignal(signal, data);

        var signalResponse = this.currentState.onSignal[signal];
        if (signalResponse) {
            this.currentState.onSignal[signal](data);

            // Check if state changed
            if (this.currentState.name != stateName) {
                return;
            }
        }
    }
    
    var transitions = this.currentState.signalTransitions;
    if (transitions) {
        for (var t=0; t<transitions.length; t++) {
            if (transitions[t].checkOnSignal(signal, data)) {
                this.executeTransition(transitions[t]);
                return;
            }
        }
    }
};

global.StateMachine.prototype.update = function() {
    if (this.currentState == null) {
        return;
    }

    this.currentState.stateElapsedTime = global.getTime() - this.currentState.stateStartTime;

    var updateTransitions = this.currentState.updateTransitions;
    if (updateTransitions) {
        for (var t=0; t<updateTransitions.length; t++) {
            if (updateTransitions[t].checkOnUpdate(this.currentState)) {
                this.executeTransition(updateTransitions[t]);
                break;
            }
        }
    }

    if (this.currentState.onUpdate != null) {
        this.currentState.onUpdate(this.currentState);
    }

    if (this.onUpdateAll != null) {
        this.onUpdateAll();
    }
};

global.StateMachine.prototype.lateUpdate = function() {
    if (this.currentState == null) {
        return;
    }
    
    this.currentState.stateElapsedTime = global.getTime() - this.currentState.stateStartTime;

    if (this.currentState.onLateUpdate != null) {
        this.currentState.onLateUpdate(this.currentState);
    }

    if (this.onLateUpdateAll != null) {
        this.onLateUpdateAll();
    }
};