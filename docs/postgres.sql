CREATE TABLE "user" (
   "id" INT NOT NULL,
   "password" VARCHAR(60) DEFAULT NULL,
   "access_token" VARCHAR(40) DEFAULT NULL,
   "email" VARCHAR(100) UNIQUE NOT NULL,
   "phone" VARCHAR(20) UNIQUE DEFAULT NULL,
   "is_shadowed" BOOLEAN NOT NULL DEFAULT FALSE,
   "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   "updated_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY ("id")
);

CREATE TABLE "user_details" (
   "id" INT NOT NULL,
   "user_id" INT NOT NULL,
   "name" VARCHAR(100) DEFAULT NULL,
   "image_url" VARCHAR(255) DEFAULT NULL,
   "company" VARCHAR(100) DEFAULT NULL,
   "gst" VARCHAR(20) DEFAULT NULL,
   "is_shadowed" BOOLEAN NOT NULL DEFAULT FALSE,
   "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   "updated_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY ("id"),
   FOREIGN KEY ("user_id") REFERENCES "user" ("id")
);

CREATE INDEX "idx_user_profile_user" ON "user_details" ("user_id");

CREATE TABLE "amazon_seller_account" (
   "id" SERIAL NOT NULL,
   "user_id" INT NOT NULL,
   "name" VARCHAR(30) NOT NULL,
   "seller_id" VARCHAR(100) DEFAULT NULL,
   "refresh_token" VARCHAR(500) DEFAULT NULL,
   "access_token" VARCHAR(500) DEFAULT NULL,
   "is_shadowed" BOOLEAN NOT NULL DEFAULT FALSE,
   "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   "updated_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY ("id"),
   FOREIGN KEY ("user_id") REFERENCES "user" ("id")
);

CREATE INDEX "idx_partner_account_user" ON "amazon_seller_account" ("user_id");

CREATE TABLE "amazon_seller_marketplace" (
  "id" INT NOT NULL,
  "seller_account_id" INT NOT NULL,
  "name" VARCHAR(30) DEFAULT NULL,
  "marketplace_id" VARCHAR(20) DEFAULT NULL,
  "country_code" varchar(2) DEFAULT NULL,
  "currency_code" VARCHAR(3) DEFAULT NULL,
  "domain_name" VARCHAR(50) DEFAULT NULL,
  "default_language" VARCHAR(5) DEFAULT NULL,
  "is_participating" BOOLEAN DEFAULT NULL,
  "has_suspended_listings" BOOLEAN DEFAULT NULL,
  "is_shadowed" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("seller_account_id") REFERENCES "amazon_seller_account" ("id")
);

CREATE TABLE amazon_sales (
   id INT NOT NULL,
   seller_account_id INT NOT NULL,
   start_unix_timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
   end_unix_timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
   unit_count INTEGER DEFAULT NULL,
   order_item_count INTEGER DEFAULT NULL,
   order_count INTEGER DEFAULT NULL,
   total_sales_amount NUMERIC DEFAULT NULL,
   total_sales_currency VARCHAR(10) DEFAULT NULL,
   average_unit_price NUMERIC DEFAULT NULL,
   average_unit_price_currency VARCHAR(10) DEFAULT NULL,
   is_shadowed BOOLEAN NOT NULL DEFAULT FALSE,
   created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY ("id"),
   FOREIGN KEY ("seller_account_id") REFERENCES "amazon_seller_account" ("id")
);

CREATE TABLE amazon_orders (
    id INT NOT NULL,
    seller_account_id INT NOT NULL,
    order_id VARCHAR(255) UNIQUE NOT NULL,
    earliest_ship_date TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
    sales_channel VARCHAR(255) DEFAULT NULL,
    has_automated_shipping BOOLEAN DEFAULT NULL,
    status VARCHAR(255) DEFAULT NULL,
    number_of_items_shipped INTEGER DEFAULT NULL,
    order_type VARCHAR(255) DEFAULT NULL,
    is_premium_order BOOLEAN DEFAULT NULL,
    is_prime BOOLEAN DEFAULT NULL,
    fulfillment_channel VARCHAR(255) DEFAULT NULL,
    number_of_items_unshipped INTEGER DEFAULT NULL,
    has_regulated_items BOOLEAN DEFAULT NULL,
    is_replacement_order BOOLEAN DEFAULT NULL,
    is_sold_by_ab BOOLEAN DEFAULT NULL,
    latest_ship_date TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
    ship_service_level VARCHAR(255) DEFAULT NULL,
    is_ispu BOOLEAN DEFAULT NULL,
    marketplace_id VARCHAR(255) DEFAULT NULL,
    purchase_date TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
    is_access_point_order BOOLEAN DEFAULT NULL,
    is_business_order BOOLEAN DEFAULT NULL,
    order_total_amount NUMERIC DEFAULT NULL,
    order_total_currency_code VARCHAR(10) DEFAULT NULL,
    payment_method_details TEXT DEFAULT NULL,
    is_global_express_enabled BOOLEAN DEFAULT NULL,
    last_update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
    is_shadowed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("seller_account_id") REFERENCES "amazon_seller_account" ("id")
);

CREATE TABLE amazon_item (
  id INT NOT NULL,
  seller_account_id INT NOT NULL,
  marketplaceId VARCHAR(255) DEFAULT NULL,
  sku VARCHAR(255) DEFAULT NULL,
  asin VARCHAR(255) DEFAULT NULL,
  productType varchar(50) DEFAULT NULL,
  conditionType varchar(50) DEFAULT NULL,
  status varchar(50) DEFAULT NULL,
  itemName varchar(255) DEFAULT NULL,
  createdDate TIMESTAMP DEFAULT NULL,
  lastUpdatedDate TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
  mainImageLink VARCHAR(255) DEFAULT NULL,
  mainImageHeight INTEGER DEFAULT NULL,
  mainImageWidth INTEGER DEFAULT NULL,
  issues TEXT DEFAULT NULL,
  offers TEXT DEFAULT NULL,
  fulfillment TEXT DEFAULT NULL,
  is_shadowed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("seller_account_id") REFERENCES "amazon_seller_account" ("id")
);

CREATE TABLE amazon_catalog_products (
  id INT NOT NULL,
  seller_account_id INT NOT NULL,
  asin VARCHAR(10) DEFAULT NULL,
  marketplaceId VARCHAR(255) DEFAULT NULL,
  adultProduct BOOLEAN DEFAULT NULL,
  autographed BOOLEAN DEFAULT NULL,
  brand VARCHAR(255) DEFAULT NULL,
  browseClassificationDisplayName VARCHAR(255) DEFAULT NULL,
  browseClassificationId VARCHAR(255) DEFAULT NULL,
  itemClassification VARCHAR(255) DEFAULT NULL,
  itemName VARCHAR(255) DEFAULT NULL,
  memorabilia BOOLEAN DEFAULT NULL,
  tradeInEligible BOOLEAN DEFAULT NULL,
  websiteDisplayGroup VARCHAR(255),
  websiteDisplayGroupName VARCHAR(255),
  attributes TEXT DEFAULT NULL,
  salesRanks TEXT DEFAULT NULL,
  is_shadowed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("seller_account_id") REFERENCES "amazon_seller_account" ("id")
);

CREATE TABLE amazon_fba_inbound (
  id INT NOT NULL,
  seller_account_id INT NOT NULL,
  asin VARCHAR(10) DEFAULT NULL,
  marketplaceId VARCHAR(255) DEFAULT NULL,
  program VARCHAR(255) DEFAULT NULL,
  isEligibleForProgram BOOLEAN DEFAULT NULL,
  ineligibilityReasonList VARCHAR(255),
  is_shadowed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("seller_account_id") REFERENCES "amazon_seller_account" ("id")
);

CREATE TABLE amazon_offers (
  id INT NOT NULL,
  seller_account_id INT NOT NULL,
  sku VARCHAR(255) DEFAULT NULL,
  status VARCHAR(255) DEFAULT NULL,
  itemCondition VARCHAR(255) DEFAULT NULL,
  marketplaceId VARCHAR(255) DEFAULT NULL,
  sellerSku VARCHAR(255) DEFAULT NULL,
  summary TEXT DEFAULT NULL,
  offers TEXT DEFAULT NULL,
  is_shadowed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("seller_account_id") REFERENCES "amazon_seller_account" ("id")
);

CREATE TABLE amazon_fba_inventory (
    id INT NOT NULL,
    seller_account_id INT NOT NULL,
    asin VARCHAR(10) DEFAULT NULL,
    fnSku VARCHAR(255) DEFAULT NULL,
    seller_sku VARCHAR(255) DEFAULT NULL,
    condition VARCHAR(255) DEFAULT NULL,
    fulfillableQuantity INTEGER DEFAULT NULL,
    inboundWorkingQuantity INTEGER DEFAULT NULL,
    inboundShippedQuantity INTEGER DEFAULT NULL,
    inboundReceivingQuantity INTEGER DEFAULT NULL,
    totalReservedQuantity INTEGER DEFAULT NULL,
    pendingCustomerOrderQuantity INTEGER DEFAULT NULL,
    pendingTransshipmentQuantity INTEGER DEFAULT NULL,
    fcProcessingQuantity INTEGER DEFAULT NULL,
    totalResearchingQuantity INTEGER DEFAULT NULL,
    totalUnfulfillableQuantity INTEGER DEFAULT NULL,
    customerDamagedQuantity INTEGER DEFAULT NULL,
    warehouseDamagedQuantity INTEGER DEFAULT NULL,
    distributorDamagedQuantity INTEGER DEFAULT NULL,
    carrierDamagedQuantity INTEGER DEFAULT NULL,
    defectiveQuantity INTEGER DEFAULT NULL,
    expiredQuantity INTEGER DEFAULT NULL,
    lastUpdatedTime TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
    productName TEXT DEFAULT NULL ,
    totalQuantity INTEGER DEFAULT NULL,
    is_shadowed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("seller_account_id") REFERENCES "amazon_seller_account" ("id")
);

CREATE TABLE amazon_product_pricing (
    id INT NOT NULL,
    seller_account_id INT NOT NULL,
    sku VARCHAR(255) DEFAULT NULL,
    marketplaceId VARCHAR(255) DEFAULT NULL,
    offers TEXT DEFAULT NULL,
    is_shadowed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("seller_account_id") REFERENCES "amazon_seller_account" ("id")
);

CREATE TABLE amazon_product_fees (
    id INT NOT NULL,
    seller_account_id INT NOT NULL,
    sku VARCHAR(255) DEFAULT NULL,
    feesEstimate TEXT DEFAULT NULL,
    feesEstimateIdentifier TEXT DEFAULT NULL,
    is_shadowed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("seller_account_id") REFERENCES "amazon_seller_account" ("id")
);

CREATE TABLE amazon_product_sales (
    id INT NOT NULL,
    seller_account_id INT NOT NULL,
    sku VARCHAR(255) DEFAULT NULL,
    marketplaceId VARCHAR(255) DEFAULT NULL,
    sales TEXT DEFAULT NULL,
    is_shadowed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("seller_account_id") REFERENCES "amazon_seller_account" ("id")
);

CREATE TABLE amazon_finances (
    id INT NOT NULL,
    seller_account_id INT NOT NULL,
    orderId VARCHAR(255) NOT NULL,
    refundEventList TEXT DEFAULT NULL,
    itemFeeList TEXT DEFAULT NULL,
    shipmentEventList TEXT DEFAULT NULL,
    is_shadowed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("seller_account_id") REFERENCES "amazon_seller_account" ("id")
);

CREATE TABLE amazon_reports (
    id INT NOT NULL,
    seller_account_id INT NOT NULL,
    marketplaceId VARCHAR(255) DEFAULT NULL,
    reportId VARCHAR(100) NOT NULL,
    reportType VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    is_shadowed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("seller_account_id") REFERENCES "amazon_seller_account" ("id")
);

CREATE TABLE amazon_report_data (
    id INT NOT NULL,
    report_id INT NOT NULL,
    startDate DATE DEFAULT NULL,
    endDate DATE DEFAULT NULL,
    data TEXT DEFAULT NULL,
    is_shadowed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("report_id") REFERENCES "amazon_reports" ("id")
);
