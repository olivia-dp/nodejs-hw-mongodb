import { Router } from 'express';
import {
  getContactByIdController,
  getContactsController,
  deleteContactController,
  createNewContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:id', ctrlWrapper(getContactByIdController));

router.delete('/contacts/:id', ctrlWrapper(deleteContactController));

router.post('/contacts', ctrlWrapper(createNewContactController));

router.patch('/contacts/:id', ctrlWrapper(patchContactController));

export default router;
