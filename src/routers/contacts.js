import { Router } from "express";

import {
  getAllContactsController,
  getContactByIdController,
  addContactController,
  upsertContactController,
  patchContactController,
  deleteContactController,
} from "../controllers/contacts.js";

import authenticate from "../middlewares/authenticate.js";

import isValidId from "../middlewares/isValidId.js";

import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import {
  contactAddSchema,
  contactPatchSchema,
} from "../validation/contacts.js";
import { uploadPhoto } from "../middlewares/upload.js";

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", ctrlWrapper(getAllContactsController));

contactsRouter.get("/:id", isValidId, ctrlWrapper(getContactByIdController));

contactsRouter.post(
  "/",
  uploadPhoto,
  validateBody(contactAddSchema),
  ctrlWrapper(addContactController)
);

contactsRouter.put("/:id", isValidId, ctrlWrapper(upsertContactController));

contactsRouter.patch(
  "/:id",
  isValidId,
  uploadPhoto,
  validateBody(contactPatchSchema),
  ctrlWrapper(patchContactController)
);

contactsRouter.delete("/:id", isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter;
