import Joi from "joi";

export const find = {

	query: Joi.object({

		email: Joi.string().email(),

		_id: Joi.string().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).length(24),
	}),
};

export const getBilling = {

	query: Joi.object({}),
};


export const update = {

	body: Joi.object({

		jobCompletedRate: Joi.number(),

		rate: Joi.number(),

		skills: Joi.array().items(Joi.string()),

		hourlyRate: Joi.number(),

		successRate: Joi.number(),

		service: Joi.string().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).length(24),

		category: Joi.string().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).length(24),

		subCategories: Joi.array().items(Joi.string()),
	}),
};


export const updateNotifySettings = {

	body: Joi.object({

		showNotification: Joi.number(),

		increaseMsg: Joi.number(),

		emailUnread: Joi.number(),

		emailUnreadTime: Joi.number(),

		offlineNoti: Joi.boolean(),

		pushNoties: Joi.array().items(Joi.number()),

		emailMe: Joi.array().items(Joi.number()),
	}),
};


export const updateCompany = {
	
	body: Joi.object({

		name: Joi.string(),

		foundedYear: Joi.string(),

		employeeCount: Joi.number(),

		overview: Joi.string(),

		canTravel: Joi.number(),

		geoRange: Joi.number(),

		vatId: Joi.string(),

		timeZone: Joi.string(),

		country: Joi.string(),

		state: Joi.string(),

		address: Joi.string(),

		isPubAddress: Joi.boolean(),
	}),
};


export const updateBilling = {

	body: Joi.object({

		country: Joi.string(), 
                
		email: Joi.string().email(),

		business_type: Joi.string(),

		individual: Joi.object(),

		business_profile: Joi.object(),

		default_currency: Joi.string(),

		external_account: Joi.string(),

		settings: Joi.object()
	}),
};

export const searchVendorInRadius = {

	body: Joi.object({

		radius: Joi.number().required(),

		lat: Joi.number().required(),

		lng: Joi.number().required(),
	}),
};