const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const campaignController = require('../controllers/campaignController');

router.use(authMiddleware);
router.post('/addCampaign', campaignController.createCampaign);
router.get('/getAll', campaignController.getAllCampaigns);
router.get('/:campaignId', campaignController.getCampaignById);
router.put('/:campaignId', campaignController.updateCampaign);
router.delete('/:campaignId', campaignController.deleteCampaign);

module.exports = router;