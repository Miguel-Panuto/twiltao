import { Router } from 'express';
import UserController from './controllers/UsersController';
import PostController from './controllers/PostsController';
import SessionController from './controllers/SessionController';
import auth from './middleware/auth';

const routes = Router();

const userController = new UserController();
const postController = new PostController();
const sessionController = new SessionController();

// User
routes.get('/user', userController.index);
routes.post('/user', userController.create);
routes.post('/session', sessionController.create);
routes.patch('/user', auth, userController.update);

// Post
routes.get('/post', postController.index);
routes.post('/post', auth, postController.create);
routes.patch('/post', auth, postController.update);
routes.delete('/post', auth, postController.delete);

export default routes;
