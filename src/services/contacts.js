import ContactCollection from "../db/models/Contact.js";
import calculatePaginationData from "../utils/calculatePaginationData.js";

import { SORT_ORDER } from "../constants/index.js";

export const getContacts = async ({
  perPage,
  page,
  sortBy = "_id",
  sortOrder = SORT_ORDER[0],
  filter = {},
}) => {
  const skip = (page - 1) * perPage;
  const dataQery = ContactCollection.find();
  if (filter.minRealeaseYear) {
    data.dataQery.where("realeaseYear").gte(filter.minRealeaseYear);
  }
  if (filter.maxRealeaseYear) {
    dataQery.where("releaseYear").lte(filter.maxRealeaseYear);
  }
  if (filter.userId) {
    dataQery.where("userId").eq(filter.userId);
  }
  const data = await dataQery
    .find()
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });
  const count = await ContactCollection.find().merge(dataQery).countDocuments();

  const paginationData = calculatePaginationData({ count, perPage, page });

  return {
    page,
    perPage,
    data,
    totalItems: count,
    ...paginationData,
  };
};

export const getContact = (filter) => ContactCollection.findById(filter);

export const createContact = (payload) => ContactCollection.create(payload);

export const updateContact = async (filter, data, options = {}) => {
  const rawResult = await ContactCollection.findOneAndUpdate(filter, data, {
    includeResultMetadata: true,
    ...options,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject?.upserted),
  };
};

export const deleteContact = (filter) =>
  ContactCollection.findOneAndDelete(filter);
