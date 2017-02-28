class Polyfill
{
	constructor(target, handler)
	{
		this.target  = target;

		this.handler = handler;
		this.handler.target = target;

		this._extend(this.target);
		this._extend(this.handler);
	}

	_extend(obj, target = false)
	{
		target = target || obj;

		let props = Object.getOwnPropertyNames(obj);

		props.forEach((propIndex) => {
			if (typeof this[propIndex] !== 'undefined') {
				return;
			}

			let propValue = obj[propIndex]

			if (typeof propValue != 'function') {
				this[propIndex] = propValue;
				return;
			}

			this[propIndex] = (...args) => {
				return propValue.apply(target, args);
			}
		});

		let proto = Object.getPrototypeOf(obj)
		proto && this._extend(proto, target);
	}
}


export default window.Proxy || Polyfill;