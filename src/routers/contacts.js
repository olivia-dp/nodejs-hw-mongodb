import { Router } from 'express';
import {
  getContactByIdController,
  getContactsController,
  deleteContactController,
  createNewContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:id', isValidId, ctrlWrapper(getContactByIdController));

router.delete('/contacts/:id', isValidId, ctrlWrapper(deleteContactController));

router.post(
  '/contacts',
  validateBody(createContactSchema),
  ctrlWrapper(createNewContactController),
);

router.patch(
  '/contacts/:id',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

export default router;
