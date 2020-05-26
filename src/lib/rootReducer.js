//v5
import { persistCombineReducers } from "redux-persist";
// import { REHYDRATE, PURGE, persistCombineReducers } from "redux-persist";
import storage from "redux-persist/lib/storage"; // or whatever storage you are using

import loginReducer from "@Components/login/essential";
import registerReducer from "@Components/register/essential";
import { ForgotPasswordReducer } from "@Components/ForgotPassword/essential";

import messagesReducer from "@Components/messages/essential";
import homeReducer from "@Components/home/essential";

import vendorSettingsReducer from "@Components/logged_vendor/settings/essential";
import vendorProfileReducer from "@Components/logged_vendor/profile/essential";

import clientDashboardReducer from "@Components/logged_client/dashboard/essential";
import clientSettingsReducer from "@Components/logged_client/settings/essential";
import clientPostjobReducer from "@Components/logged_client/postjob/essential";
import clientJobDetailsReducer from "@Components/logged_client/jobDetails/essential";
import clientContractDetailsReducer from "@Components/logged_client/contractDetails/essential";
import clientReviewReducer from "@Components/logged_client/givefeedback/essential";
import clientHireDetailReducer from "@Components/hire/essential";

import vendorFindJobReducer from "@Components/logged_vendor/findJob/essential";
import vendorJobDetailsReducer from "@Components/logged_vendor/jobDetails/essential";
import vendorPlaceBidReducer from "@Components/logged_vendor/placebid/essential";
import vendorViewTeamReducer from "@Components/logged_vendor/viewTeam/essential";
import vendorDashboardReducer from "@Components/logged_vendor/dashboard/essential";
import vendorContractDetailsReducer from "@Components/logged_vendor/contractDetails/essential";
import vendorReviewReducer from "@Components/logged_vendor/givefeedback/essential";
import clientFindVendorReducer from "@Components/findvendors/essential";
import questionReducer from "@Components/logged_vendor/question&answer/essential";

import headerNotiReducer from "@Components/inc/essential";
import notificationReducer from "@Components/notification/essential";
import disputeReducer from "@Components/dispute/essential";

const reducers = {
  loginReducer,
  registerReducer,
  ForgotPasswordReducer,
  homeReducer,
  messagesReducer,
  clientDashboardReducer,
  clientPostjobReducer,
  clientSettingsReducer,
  clientJobDetailsReducer,
  clientContractDetailsReducer,
  clientReviewReducer,
  clientHireDetailReducer,
  clientFindVendorReducer,
  vendorProfileReducer,
  vendorSettingsReducer,
  vendorDashboardReducer,
  vendorFindJobReducer,
  vendorJobDetailsReducer,
  vendorPlaceBidReducer,
  vendorViewTeamReducer,
  vendorContractDetailsReducer,
  vendorReviewReducer,
  headerNotiReducer,
  notificationReducer,
  disputeReducer,
  questionReducer,
};
const config = {
  key: "primary",
  storage,
  timeout: null,
};

export default persistCombineReducers(config, reducers);
