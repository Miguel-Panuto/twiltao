import { Router } from 'express';
import UserController from './controllers/UsersController';
import PostController from './controllers/PostsController';
import SessionController from './controllers/SessionController';
import auth from './middleware/auth';

const routes = Router();

// User
routes.get('/user', UserController.index);
routes.post('/user', UserController.create);
routes.post('/session', SessionController.create);
routes.patch('/user', auth, UserController.update);

// Post
routes.get('/post', PostController.index);
routes.post('/post', auth, PostController.create);
routes.patch('/post', auth, PostController.update);
routes.delete('/post', auth, PostController.delete);

export default routes;
