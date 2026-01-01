import expressAsyncHandler from "express-async-handler";
import { HTTPSTATUS } from "../constants/httpstatus.js";
import { getActiveTimerForProduct } from "../services/storefront.service.js";

export const getStorefrontTimer = expressAsyncHandler(async (req, res, next) => {
    console.log("storefrontTimerRoutes hit:", req.query);
    const { shop, product_id: productId, collectionIds } = req.query;
    if (!req.query.product_id) {
        // will be timer routes temporary fix
        return next()
    }

    if (!productId) {
        res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: 'productId is required',
        });
        return;
    }

    const timer = await getActiveTimerForProduct({
        shop,
        productId,
        collectionIds:
            typeof collectionIds === 'string' ? collectionIds.split(',') : [],
    });
    console.log('timer found', timer);

    res.status(HTTPSTATUS.OK).json({
        data: timer,
    });
});