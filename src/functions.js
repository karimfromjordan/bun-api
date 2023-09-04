import {
	optional,
	object,
	string,
	boolean,
	number,
	minLength,
	maxLength,
	enumType,
	isoDate,
	isoDateTime,
	toTrimmed,
	parse
} from 'valibot';

function file(value) {
	value instanceof File && value.size > 0;
}

const functions = {
	users: {
		create(params, locals) {},
		update(params, locals) {},
		delete(params, locals) {}
	}
};

const schemas = {
	users: {
		create: object({}),
		update: object({}),
		delete: object({})
	}
};

export { functions, schemas };
