const ignoredMethodNames = [
    'constructor',
    'componentWillMount',
    'render',
    'componentDidMount',
    'UNSAFE_componentWillReceiveProps',
    'componentWillReceiveProps',
    'shouldComponentUpdate',
    'componentWillUpdate',
    'componentDidUpdate',
    'componentWillUnmount',
];

// This entire file is heavily inspired by
// https://github.com/jayphelps/core-decorators.js
function autobindMethod(target, key, {value: fn, configurable, enumerable}) {
    const {constructor} = target;

    return {
        configurable,
        enumerable,
        get() {
            // Class.prototype.key lookup
            // Someone accesses the property directly on the prototype on which it is
            // actually defined on, i.e. Class.prototype.hasOwnProperty(key)
            if (this === target) {
                return fn;
            }

            // Class.prototype.key lookup
            // Someone accesses the property directly on a prototype but it was found
            // up the chain, not defined directly on it
            // i.e. Class.prototype.hasOwnProperty(key) == false && key in Class.prototype
            if (
                this.constructor !== constructor &&
                Object.getPrototypeOf(this).constructor === constructor
            ) {
                return fn;
            }

            const boundFn = fn.bind(this);

            Object.defineProperty(this, key, {
                configurable: true,
                writable: true,
                // NOT enumerable when it's a bound method
                enumerable: false,
                value: boundFn,
            });

            return boundFn;
        },
        set(newValue) {
            Object.defineProperty(this, key, {
                configurable: true,
                writable: true,
                // IS enumerable when reassigned by the outside word
                enumerable: true,
                value: newValue,
            });

            return newValue;
        },
    };
}

/**
 * Automatically binds `this` on methods of React class components so that
 * instance methods can be passed around without worrying about capturing
 * `this`. For example:
 *      class Foo extends React.Component {
 *          handleClick() {
 *              return this;
 *          }
 *      }
 *      const AutobindFoo = bindReactClass(Foo);
 *      const fooInstance = new AutobindFoo();
 *      fooInstance.handleClick() === fooInstance; // true
 *      fooInstance.handleClick.call(null) === fooInstance; // true
 *
 * NOTE: This function _does not_ auto-bind React lifecycle methods (e.g.,
 * `render`, `shouldComponentUpdate`).
 *
 * NOTE: Mutates `target`.
 *
 * @param {Function} target - The class (or class-like function) to auto-bind
 *
 * @returns {Function} - A modified version of `target`
 */
module.exports = function bindReactClass(target) {
    Object.getOwnPropertyNames(target.prototype).forEach((prop) => {
        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, prop);
        if (
            typeof descriptor.value === 'function' &&
            ignoredMethodNames.indexOf(prop) === -1
        ) {
            Object.defineProperty(
                target.prototype,
                prop,
                autobindMethod(target.prototype, prop, descriptor)
            );
        }
    });
    return target;
};
