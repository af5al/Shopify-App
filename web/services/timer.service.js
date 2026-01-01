import Timer from "../models/timer.model.js";
import { notDeleted, softDelete } from "../utils/dbQueries.js";

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


export const getTimerById = async (shop, id) => {
  return Timer.findOne({
    _id: id,
    shop,
    ...notDeleted,
  });
};

export const updateTimer = async (shop, id, payload) => {
  return Timer.findOneAndUpdate(
    { _id: id, shop, ...notDeleted },
    payload,
    { new: true, runValidators: true }
  );
};

export const deleteTimer = async (shop, id) => {
  return Timer.findOneAndUpdate(
    { _id: id, shop, ...notDeleted },
    softDelete,
    { new: true }
  );
};