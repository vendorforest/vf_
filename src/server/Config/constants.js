export const constants = {
  ACCOUNT_TYPE: {
    CLIENT: 0,
    VENDOR: 1,
    PROVENDOR: 2,
    VENUE: 3,
  },
  ACCOUNTTYPES: ["client", "vendor", "provendor", "venue"],
  BILLING_METHOD_TYPE: {
    CREDIT_CARD: 0,
    PAYPAL: 1,
  },
  PROD_COMMONERROR_MSG:
    "Sorry. We have found some error while processing your request. Please try again later.",
  DEV_EMPTYDOC_MSG: "doc doesn't exist",
  BUDGET_TYPE: {
    FIXED: 0,
    HOURLY: 1,
  },
  JOB_VISIBILITY: {
    ANYONE: 0,
    ONLY_VENDOR: 1,
    ONLY_INVITE: 2,
  },
  AVB_HRS_PERWEEK: {
    LESS10: 0,
    LESS30: 1,
    MORE30: 2,
  },
  AVB_HRSPERWEEKS: ["Less than 10hrs/week", "10 ~ 30hrs/week", "30+ hrs/week "],
  JOB_STATUS: {
    PPOSTED: 0,
    HIRED: 1,
    COMPLETED: 2,
    CANCELED: 3,
    CLOSED: 4,
  },
  BID_TYPE: {
    INDIVIDUAL: 0,
    TEAM: 1,
  },
  OFFER_STATUS: {
    CREATED: 0,
    ACCEPT: 1,
    DECLINE: 2,
  },
  PROPOSAL_STATUS: {
    CREATED: 0,
    DECLINE: 1,
    HIRED: 2,
  },
  NOTIFICATION_STATUS: {
    CREATED: 0,
    DELETED: 1,
  },
  CONTRACT_STATUS: {
    CREATED: 0,
    END: 1,
  },
  DISPUTE: {
    OPEN: 0,
    CLOSED: 1,
  },
  MILESTONE_STATUS: {
    CREATED: 0,
    REQ_RELEASED: 1,
    RELEASED: 2,
  },
  ENDCONTRACT_REASON: {
    COMPLETED: 0,
    NO_EXPERIENCE: 1,
    OTHER: 2,
  },
  VENDOR_BADGES: {
    ONTIME: 0,
    SKILLFUL: 1,
    EXCELLENT: 2,
    BYOND: 3,
    ENTERTAINING: 4,
    GREATE: 5,
  },
  PORTFOLIO_TYPE: {
    IMAGE: 0,
    VIDEO: 1
  },
  DEFAULT_PROFILE_PHOTO: 'https://res.cloudinary.com/vendorforest-com-inc/image/upload/v1590054218/vendorforest/user_default_icon_ahiwz6.png'
};
