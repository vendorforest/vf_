import getEnv, { constants} from "@Config/index";
const env = getEnv();
// @ts-ignore
const stripe = require('stripe')(env.STRIPE_SECRET_KEY);

export default () => {

    const controllers = {};
    
    controllers.createAccount = async(email) => {
        try {

            return await stripe.accounts.create( { 
                
                type: 'custom', email: email,
            
                requested_capabilities: [ 'card_payments', 'transfers' ],
            });

        } catch (e) {env.MODE === "development" && console.log("Errror: ", e) }
    };

    controllers.updateAccount = async(accountId, data, next) => {
        try {

            if (data.external_account) {

                const account = await stripe.accounts.retrieve(accountId);

                let deleteExtAccountId;

                if (account.external_accounts && account.external_accounts.data.length > 0) deleteExtAccountId = account.external_accounts.data[0].id

                await stripe.accounts.createExternalAccount(accountId, {external_account: data.external_account, default_for_currency: true});

                if (deleteExtAccountId) await stripe.accounts.deleteExternalAccount(accountId, deleteExtAccountId)

                delete data.external_account;
            }

            return await stripe.accounts.update(accountId,  data);

        } catch (e) { next(e) }
    };

    controllers.getAccount = async(accountId) => {

        try {

            return await stripe.accounts.retrieve(accountId)

        } catch (e) {env.MODE === "development" && console.log("Errror: ", e) }
    };

    controllers.deleteAccount = async(accountId) => {
        try {

            await stripe.accounts.del(accountId)

        } catch (e) {env.MODE === "development" && console.log("Errror: ", e) }
    };

    controllers.createFile = async(data) => {
        try {

            return await stripe.files.create({

                purpose: 'identity_document', 
                
                file: { data: data.file, name: data.name, type: 'application/octet-stream'}
            });

        } catch (e) {env.MODE === "development" && console.log("Errror: ", e) }
    };

    controllers.createCustomer = async(data) => {
        try {

            return await stripe.customers.create({name: data.name, email: data.email})

        } catch (e) {env.MODE === "development" && console.log("Errror: ", e) }
    };

    controllers.getCustomer = async(customerId) => {
        try {

            return await stripe.customers.retrieve(customerId)

        } catch (e) {env.MODE === "development" && console.log("Errror: ", e) }
    };
    
    controllers.updateCustomer = async(customerId, data) => {
        try {

            return await stripe.customers.update(customerId, data)

        } catch (e) {env.MODE === "development" && console.log("Errror: ", e) }
    };

    controllers.createPymentIntent = async(customerId, data) => {
        try {

            const paymentMethods = await stripe.paymentMethods.list({ customer: customerId, type: "card" });

            const defaultPaymentMethod = paymentMethods.data[0].id;

            return await stripe.paymentIntents.create({ 
                
                amount: data.amount * 100, currency: "usd", 
                
                customer: customerId,

				payment_method: defaultPaymentMethod,

				confirm: true,
			});

        } catch (e) {env.MODE === "development" && console.log("Errror: ", e) }
    };

    controllers.createTransfers = async(accountId, data) => {
        try {

            return await stripe.transfers.create({ 
                
                amount: data.amount * 100,

                currency: "usd",

                destination: accountId,
			});

        } catch (e) {env.MODE === "development" && console.log("Errror: ", e) }
    };

    return controllers;
}