const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const getAccessToken = async () => {
    try {
        const response = await axios.post('https://login.salesforce.com/services/oauth2/token', null, {
            params: {
                grant_type: 'password',
                client_id: '3MVG9pRzvMkjMb6naRM353RGyfAVG05qspToE6D9DjW7WgbW44oWmgcjZ_2hzw.JB5wLMzVFSYa9P.KPIX3cT',
                client_secret: 'C674AA925B7715ABCD802FEAE1D110A4B544EB3ADF26FAB41BCE41EBAC06ABA6',
                username: 'harsh@mvclouds.sandbox',
                password: 'hgandhi1907xYIo0jtI8G2lGF6aYvCYAkNX', // Append security token if required
            },
        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        throw error;
    }
};

app.get('/salesforce/contacts', async (req, res) => {
    try {
        const tokenData = await getAccessToken();
        const instanceUrl = tokenData.instance_url;
        const accessToken = tokenData.access_token;

        const response = await axios.get(`${instanceUrl}/services/data/v59.0/query/?q=SELECT+Id,Name+FROM+Contact`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        res.setHeader('Content-Type', 'application/json');
        res.json(response.data.records);
    } catch (error) {
        console.error('Error fetching data from Salesforce:', error);
        res.status(500).send('Error fetching data from Salesforce');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
