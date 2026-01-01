import Timer from "../models/timer.model.js";
import { notDeleted } from "../utils/dbQueries.js";

export const getActiveTimerForProduct = async ({
  shop,
  productId,
  collectionIds = [],
  now = new Date(),
}) => {
  const timer = await Timer.findOne({
    shop,
    status: "scheduled",
    ...notDeleted,

    $or: [
      { "targeting.type": "all" },
      {
        "targeting.type": "products",
        "targeting.productIds": productId,
      },
      {
        "targeting.type": "collections",
        "targeting.collectionIds": { $in: collectionIds },
      },
    ],

    $or: [
      // FIXED TIMER: must be within start & end
      {
        type: "fixed",
        startAt: { $lte: now },
        endAt: { $gte: now },
      },

      // EVERGREEN TIMER: always active
      {
        type: "evergreen",
      },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  if (!timer) return null;

  // Increment impressions
  Timer.updateOne(
    { _id: timer._id },
    { $inc: { impressions: 1 } }
  ).catch(() => {});

  return timer;
};