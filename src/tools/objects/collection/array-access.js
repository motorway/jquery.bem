class ArrayAccess
{
	get(target, name)
	{
		if (name in target) {
			return target[name];
		} else if (!Number.isNaN(name)) {
			return target.get(name);
		}

		return window.undef;
	}
}

export default ArrayAccess;