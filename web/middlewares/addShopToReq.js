const addSessionShopToReqParams = (req, res, next) => {
  const shop = res.locals?.shopify?.session?.shop || req.query.shop;

  console.log('shop adding to request',req.query, shop);
  if (shop) {
    req.query.shop = shop;
  }
  return next();
};

export default addSessionShopToReqParams;