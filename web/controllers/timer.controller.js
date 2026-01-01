import asyncHandler from 'express-async-handler';
import { HTTPSTATUS } from '../constants/httpstatus.js';
import {
    createTimer,
    listTimers,
    getTimerById,
    updateTimer,
    deleteTimer,
} from '../services/timer.service.js';

export const create = asyncHandler(async (req, res) => {
    const shop = res.locals.shopify.session.shop;
    const timer = await createTimer(shop, req.body);

    res.status(HTTPSTATUS.CREATED).json({
        message: 'Timer created successfully',
        data: timer,
    });
});

export const list = asyncHandler(async (req, res) => {
    const shop = res.locals.shopify.session.shop;

    const {
        page = '1',
        limit = '10',
        sortBy = 'createdAt',
        sortOrder = 'desc',
    } = req.query;

    const result = await listTimers({
        shop,
        page: Math.max(1, parseInt(page, 10)),
        limit: Math.min(100, parseInt(limit, 10)),
        sortBy,
        sortOrder,
    });

    res.status(HTTPSTATUS.OK).json(result);
});

export const getOne = asyncHandler(async (req, res) => {
    const shop = res.locals.shopify.session.shop;
    const { id } = req.params;
    
    const timer = await getTimerById(shop, id);

    if (!timer) {
        res.status(HTTPSTATUS.NOT_FOUND).json({ message: 'Timer not found' });
        return;
    }

    res.status(HTTPSTATUS.OK).json(timer);
});

export const update = asyncHandler(async (req, res) => {
    const shop = res.locals.shopify.session.shop;
    const { id } = req.params;

    const timer = await updateTimer(shop, id, req.body);

    if (!timer) {
        res.status(HTTPSTATUS.NOT_FOUND).json({ message: 'Timer not found' });
        return;
    }

    res.status(HTTPSTATUS.OK).json({
        message: 'Timer updated successfully',
        data: timer,
    });
});

export const destroy = asyncHandler(async (req, res) => {
    const shop = res.locals.shopify.session.shop;
    const { id } = req.params;

    const timer = await deleteTimer(shop, id);

    if (!timer) {
        res.status(HTTPSTATUS.NOT_FOUND).json({ message: 'Timer not found' });
        return;
    }

    res.status(HTTPSTATUS.OK).json({
        message: 'Timer deleted successfully',
    });
});
