const Campaign = require('../models/campaignModel');

const createCampaign = (req, res) => {
    const campaign = new Campaign({
        name: req.body.name,
        description: req.body.description,
        status: req.body.status || "Draft",
        selectedTags: req.body.selectedTags || [],
        message: {
            text: req.body.message.text,
            imageUrl: req.body.message.imageUrl
        },
        launchedAt: req.body.launchedAt,
        workspaceId: req.body.workspaceId,
        createdBy: req.user.userId,
        messages: req.body.messages || []
    });

    campaign.save()
        .then(result => {
            res.status(201).json({
                message: "Campaign created successfully",
                campaign: result,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/campaign/" + result._id,
                },
            });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

const getAllCampaigns = (req, res) => {
    Campaign.find()
        .then(campaigns => {
            res.status(200).json({
                message: "Campaigns retrieved successfully",
                data: campaigns
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Error retrieving campaigns",
                error: err
            });
        });
};

const getCampaignById = (req, res) => {
    const campaignId = req.params.campaignId;
    Campaign.findById(campaignId)
        .then(campaign => {
            if (!campaign) {
                return res.status(404).json({ message: "Campaign not found" });
            }
            res.status(200).json({
                message: "Campaign retrieved successfully",
                data: campaign
            });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

module.exports = {
    createCampaign,
    getAllCampaigns,
    getCampaignById
};

const updateCampaign = (req, res) => {
    const campaignId = req.params.campaignId;
    Campaign.findByIdAndUpdate(campaignId, req.body, { new: true })
        .then(updatedCampaign => {
            if (!updatedCampaign) {
                return res.status(404).json({ message: "Campaign not found" });
            }
            res.status(200).json({
                message: "Campaign updated successfully",
                data: updatedCampaign
            });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

const deleteCampaign = (req, res) => {
    const campaignId = req.params.campaignId;
    Campaign.findByIdAndDelete(campaignId)
        .then(result => {
            if (!result) {
                return res.status(404).json({ message: "Campaign not found" });
            }
            res.status(200).json({
                message: "Campaign deleted successfully"
            });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

module.exports = {
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign
};