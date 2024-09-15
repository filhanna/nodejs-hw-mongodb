import createHttpError from "http-errors";

import * as contactServises from "../services/contacts.js";

export const getAllContactsController = async (req, res) => {
  const data = await contactServises.getAllContacts();
  res.json({
    status: 200,
    message: "Successfully found contacts!",
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const data = await contactServises.getContactById(id);

  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: `Contact with ${id} successfully find!`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const data = await contactServises.createContact(req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;
  const { isNew, data } = await contactServises.updateContact(
    { _id: id },
    req.body,
    { upsert: true }
  );

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status: 200,
    message: "Contact upsert successfully",
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const result = await contactServises.updateContact({ _id: id }, req.body);

  if (!result) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: "Successfully patched a contact!",
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const data = await contactServises.deleteContact({ _id: id });

  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.status(204).send();
};
