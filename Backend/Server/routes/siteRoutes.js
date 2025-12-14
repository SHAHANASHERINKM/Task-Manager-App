const express=require('express');
const router=express.Router();
const siteController=require('../controller/siteController.js');
const auth=require('../midleware/auth.js');


router.get('/',siteController.home);
router.post('/api/auth/signup',siteController.signup);
router.post('/api/auth/login',siteController.login);
router.post('/api/auth/task',auth,siteController.createTask);
router.get('/api/auth/tasks',auth,siteController.getTasks);
router.get('/api/auth/tasksByStatus',auth,siteController.getTasksByStatus);
router.put('/api/auth/task/:id',auth,siteController.updateTask);
router.delete('/api/auth/task/:id', auth, siteController.deleteTask);

module.exports=router;