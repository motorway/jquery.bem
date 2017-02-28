/*global Symbol */
import "./array-access";

let _items = Symbol.for('items');

class ObjectsCollection
{
	static from(args = [])
	{
		if (window.Proxy) {
			return new Proxy(new this(args), new ArrayAccess());
		}

		return new this(args);
	}

	static make()
	{
		return this.from([]);
	}

	get length()
	{
		return this[_items].length;
	}

	get self()
	{
		return this.constructor;
	}

	constructor(...args)
	{
		this[_items] = args.length && Array.isArray(args[0]) ? args[0] : args;
	}

	/**
	 * Возвращает элемент по индексу
	 *
	 * @param index
	 */
	get(index)
	{
		return this[_items][index];
	}

	/**
	 * Вызовет метод fn на каждом значении list.
	 * Все дополнительные аргументы, если они переданы в массиве args будут также переданы при вызове fn
	 *
	 * @param fn
	 * @param args
	 */
	invokeArray(fn, args)
	{
		this.forEach((elem) => {
			elem[fn].apply(elem, args);
		});
	}

	/**
	 * Вызовет метод fn на каждом значении list.
	 * Все дополнительные аргументы, если они переданы в invoke будут также переданы при вызове fn
	 *
	 * @param fn
	 * @param args
	 */
	invoke(fn, ...args)
	{
		return this.invokeArray(fn, args);
	}

	/**
	 * Возвращает первый элемент в коллекции
	 */
	first()
	{
		return this.get(0);
	}

	/**
	 * Возвращает последний элемент в коллекции
	 */
	last()
	{
		return this.get(this.length - 1);
	}

	/** Array methods */

	[Symbol.iterator](...args)
	{
		return [][Symbol.iterator].apply(this[_items], args);
	}

	concat(...args)
	{
		let items = [].concat.apply(this[_items], args);

		return this.self.from(items);
	}

	copyWithin(...args)
	{
		return [].copyWithin.apply(this[_items], args);
	}

	entries()
	{
		return this[Symbol.iterator];
	}

	every(...args)
	{
		return [].every.apply(this[_items], args);
	}

	fill(...args)
	{
		return [].fill.apply(this[_items], args);
	}

	filter(...args)
	{
		let items = [].filter.apply(this[_items], args);

		return this.self.from(items);
	}

	find(...args)
	{
		return [].find.apply(this[_items], args);
	}

	findIndex(...args)
	{
		return [].findIndex.apply(this[_items], args);
	}

	forEach(...args)
	{
		return [].forEach.apply(this[_items], args);
	}

	includes(...args)
	{
		return [].includes.apply(this[_items], args);
	}

	join(...args)
	{
		return [].join.apply(this[_items], args);
	}

	keys(...args)
	{
		return [].keys.apply(this[_items], args);
	}

	indexOf(...args)
	{
		return [].indexOf.apply(this[_items], args);
	}

	lastIndexOf(...args)
	{
		return [].lastIndexOf.apply(this[_items], args);
	}

	map(...args)
	{
		let items = [].map.apply(this[_items], args);

		return this.self.from(items);
	}

	pop(...args)
	{
		return [].pop.apply(this[_items], args);
	}

	push(...args)
	{
		return [].push.apply(this[_items], args);
	}

	reduce(...args)
	{
		return [].reduce.apply(this[_items], args);
	}

	reverse(...args)
	{
		return [].reverse.apply(this[_items], args);
	}

	shift(...args)
	{
		return [].shift.apply(this[_items], args);
	}

	slice(...args)
	{
		let items = [].slice.apply(this[_items], args);

		return this.self.from(items);
	}

	some(...args)
	{
		return [].some.apply(this[_items], args);
	}

	sort(...args)
	{
		return [].sort.apply(this[_items], args);
	}

	splice(...args)
	{
		return [].splice.apply(this[_items], args);
	}

	toLocaleString(...args)
	{
		return [].toLocaleString.apply(this[_items], args);
	}

	toString(...args)
	{
		return [].toString.apply(this[_items], args);
	}

	unshift(...args)
	{
		return [].unshift.apply(this[_items], args);
	}

	values(...args)
	{
		return [].values.apply(this[_items], args);
	}
}

export default ObjectsCollection;