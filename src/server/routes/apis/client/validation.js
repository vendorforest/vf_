import Joi from "joi";


export const updateNotifySettings =  {

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


export const updateBilling =  {

	body: Joi.object({

		cardToken: Joi.string(),
	}),
};
