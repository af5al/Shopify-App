import Timer from "../models/timer.model.js";
import { notDeleted, softDelete } from "../utils/dbQueries.js";

/* ===============================
   CREATE
=============================== */
export const createTimer = async (shop, payload) => {
  const exists = await Timer.findOne({
    shop,
    name: payload.name,
    ...notDeleted,
  });

  if (exists) {
    const error = new Error("Timer with this name already exists");
    error.statusCode = 400;
    throw error;
  }

  return Timer.create({
    ...payload,
    shop,
  });
};

/* ===============================
   LIST (ADMIN)
=============================== */
export const listTimers = async ({
  shop,
  page,
  limit,
  sortBy,
  sortOrder,
}) => {
  const query = {
    shop,
    ...notDeleted,
  };

  const total = await Timer.countDocuments(query);

  const pages = Math.max(1, Math.ceil(total / limit));

  const sort = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  const timers = await Timer.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return {
    data: timers,
    meta: {
      total,
      page,
      pages,
      limit,
    },
  };
};

/* ===============================
   GET ONE
=============================== */
export const getTimerById = async (shop, id) => {
  return Timer.findOne({
    _id: id,
    shop,
    ...notDeleted,
  });
};

/* ===============================
   UPDATE
=============================== */
export const updateTimer = async (shop, id, payload) => {
  return Timer.findOneAndUpdate(
    { _id: id, shop, ...notDeleted },
    payload,
    { new: true, runValidators: true }
  );
};

/* ===============================
   SOFT DELETE
=============================== */
export const deleteTimer = async (shop, id) => {
  return Timer.findOneAndUpdate(
    { _id: id, shop, ...notDeleted },
    softDelete,
    { new: true }
  );
};

/* ===============================
   STOREFRONT FETCH
=============================== */
export const getActiveTimerForProduct = async ({
  shop,
  productId,
  collectionIds = [],
  now = new Date(),
}) => {
  const timer = await Timer.findOne({
    shop,
    status: "active",
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
  }).lean();

  if (!timer) return null;

  // increment impressions async (non-blocking)
  Timer.updateOne({ _id: timer._id }, { $inc: { impressions: 1 } }).catch(
    () => {}
  );

  return timer;
};


function normalizeProductId(rawId) {
  if (!rawId) return null;
  const str = String(rawId);

  // Extract last sequence of digits
  const match = str.match(/\d+$/);
  return match ? match[0] : str;
}

export async function findActiveTimerForProduct({ shop, productId }) {
  const now = new Date();
  const normalizedProductId = normalizeProductId(productId);

  if (!shop || !normalizedProductId) {
    return null;
  }

  // Fetch all timers for this shop. You can optimize later with more specific queries.
  const timers = await Timer.find({ shop }).lean();
  console.log('timers fetched in controller', timers);


  // for (const timer of timers) {
  //   // 1) Check time window
  //   if (!isTimerInTimeWindow(timer, now)) {
  //     continue;
  //   }

  //   // 2) Check targeting
  //   if (!doesTimerTargetProduct(timer, normalizedProductId)) {
  //     continue;
  //   }

  //   // First match wins. You can change this to choose highest priority, etc.
  //   return timer;
  // }

  return timers[0] || null;
}

// function isTimerInTimeWindow(timer, now) {
//   if (!timer || !timer.type) return false;

//   console.log('Checking timer time window', now < timer.startAt, now > timer.endAt);
//   if (timer.type === "fixed") {
//     if (timer.startAt && now < timer.startAt)return false;
//     if (timer.endAt && now > timer.endAt) return false;
//     return true;
//   }

//   if (timer.type === "evergreen") {
//     return true;
//   }

//   return false;
// }

// function doesTimerTargetProduct(timer, normalizedProductId) {
//   const targeting = timer.targeting || { type: "all" };

//   if (!targeting.type || targeting.type === "all") {
//     return true;
//   }

//   if (targeting.type === "products") {
//     const ids = targeting.productIds || [];
//     return ids.includes(normalizedProductId);
//   }

//   if (targeting.type === "collections") {
//     return false;
//   }

//   return false;
// }