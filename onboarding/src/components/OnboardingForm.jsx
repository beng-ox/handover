import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const OnboardingForm = () => {
  const [formData, setFormData] = useState({
    primaryBusinessCase: '',
    goals: {
      longTerm: '',
      mediumTerm: '',
      shortTerm: '',
    },
    keyPlayers: [],
    technicalStack: {
      sourceControl: '',
      pipelineTools: '',
      containerRegistries: '',
      kubernetesRegistries: '',
      cloudDeployments: '',
      languages: '',
      packageManagers: '',
    },
    featureRequests: [],
    troubleAreas: '',
  });

  const [newKeyPlayer, setNewKeyPlayer] = useState({
    name: '',
    focus: '',
    geo: '',
    kpis: '',
  });

  const [newFeatureRequest, setNewFeatureRequest] = useState({
    description: '',
    jiraTicket: '',
    importance: '',
    dueDate: null,
  });

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof prev[section] === 'object' 
        ? { ...prev[section], [field]: value }
        : value
    }));
  };

  const addKeyPlayer = () => {
    if (newKeyPlayer.name) {
      setFormData(prev => ({
        ...prev,
        keyPlayers: [...prev.keyPlayers, { ...newKeyPlayer }]
      }));
      setNewKeyPlayer({ name: '', focus: '', geo: '', kpis: '' });
    }
  };

  const removeKeyPlayer = (index) => {
    setFormData(prev => ({
      ...prev,
      keyPlayers: prev.keyPlayers.filter((_, i) => i !== index)
    }));
  };

  const addFeatureRequest = () => {
    if (newFeatureRequest.description) {
      setFormData(prev => ({
        ...prev,
        featureRequests: [...prev.featureRequests, { ...newFeatureRequest }]
      }));
      setNewFeatureRequest({
        description: '',
        jiraTicket: '',
        importance: '',
        dueDate: null,
      });
    }
  };

  const removeFeatureRequest = (index) => {
    setFormData(prev => ({
      ...prev,
      featureRequests: prev.featureRequests.filter((_, i) => i !== index)
    }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPos = 10;

    // Title
    doc.setFontSize(20);
    doc.text('Onboarding Form Report', 105, yPos, { align: 'center' });
    yPos += 20;

    // Primary Business Case
    doc.setFontSize(16);
    doc.text('Primary Business Case', 10, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(formData.primaryBusinessCase, 10, yPos);
    yPos += 20;

    // Goals
    doc.setFontSize(16);
    doc.text('Goals', 10, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text('Long-term Goals:', 10, yPos);
    yPos += 7;
    doc.text(formData.goals.longTerm, 10, yPos);
    yPos += 10;
    doc.text('Medium-term Goals:', 10, yPos);
    yPos += 7;
    doc.text(formData.goals.mediumTerm, 10, yPos);
    yPos += 10;
    doc.text('Short-term Goals:', 10, yPos);
    yPos += 7;
    doc.text(formData.goals.shortTerm, 10, yPos);
    yPos += 20;

    // Key Players
    doc.setFontSize(16);
    doc.text('Key Players', 10, yPos);
    yPos += 10;
    doc.setFontSize(12);
    formData.keyPlayers.forEach(player => {
      doc.text(`Name: ${player.name}`, 10, yPos);
      yPos += 7;
      doc.text(`Focus: ${player.focus}`, 10, yPos);
      yPos += 7;
      doc.text(`Geo: ${player.geo}`, 10, yPos);
      yPos += 7;
      doc.text(`KPIs: ${player.kpis}`, 10, yPos);
      yPos += 10;
    });
    yPos += 10;

    // Technical Stack
    doc.setFontSize(16);
    doc.text('Technical Stack', 10, yPos);
    yPos += 10;
    doc.setFontSize(12);
    Object.entries(formData.technicalStack).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 10, yPos);
      yPos += 7;
    });
    yPos += 10;

    // Feature Requests
    doc.setFontSize(16);
    doc.text('Feature Requests', 10, yPos);
    yPos += 10;
    doc.setFontSize(12);
    formData.featureRequests.forEach(request => {
      doc.text(`Description: ${request.description}`, 10, yPos);
      yPos += 7;
      doc.text(`Jira Ticket: ${request.jiraTicket}`, 10, yPos);
      yPos += 7;
      doc.text(`Importance: ${request.importance}`, 10, yPos);
      yPos += 7;
      doc.text(`Due Date: ${request.dueDate ? request.dueDate.format('YYYY-MM-DD') : 'Not set'}`, 10, yPos);
      yPos += 10;
    });
    yPos += 10;

    // Trouble Areas
    doc.setFontSize(16);
    doc.text('Trouble Areas', 10, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(formData.troubleAreas, 10, yPos);

    doc.save('onboarding-form.pdf');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Onboarding Form
        </Typography>

        {/* Primary Business Case */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Primary Business Case
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={formData.primaryBusinessCase}
            onChange={(e) => handleInputChange('primaryBusinessCase', null, e.target.value)}
          />
        </Box>

        {/* Goals Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Goals
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Long-term Goals"
                multiline
                rows={2}
                value={formData.goals.longTerm}
                onChange={(e) => handleInputChange('goals', 'longTerm', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Medium-term Goals"
                multiline
                rows={2}
                value={formData.goals.mediumTerm}
                onChange={(e) => handleInputChange('goals', 'mediumTerm', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short-term Goals"
                multiline
                rows={2}
                value={formData.goals.shortTerm}
                onChange={(e) => handleInputChange('goals', 'shortTerm', e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Key Players Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Key Players
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Name"
                value={newKeyPlayer.name}
                onChange={(e) => setNewKeyPlayer(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Focus"
                value={newKeyPlayer.focus}
                onChange={(e) => setNewKeyPlayer(prev => ({ ...prev, focus: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Geo"
                value={newKeyPlayer.geo}
                onChange={(e) => setNewKeyPlayer(prev => ({ ...prev, geo: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="KPIs"
                value={newKeyPlayer.kpis}
                onChange={(e) => setNewKeyPlayer(prev => ({ ...prev, kpis: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                startIcon={<AddIcon />}
                onClick={addKeyPlayer}
                variant="contained"
              >
                Add Player
              </Button>
            </Grid>
          </Grid>

          <List>
            {formData.keyPlayers.map((player, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={player.name}
                  secondary={`Focus: ${player.focus} | Geo: ${player.geo} | KPIs: ${player.kpis}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => removeKeyPlayer(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Technical Stack Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Technical Stack
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(formData.technicalStack).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  fullWidth
                  label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  value={value}
                  onChange={(e) => handleInputChange('technicalStack', key, e.target.value)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Feature Requests Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Feature Requests
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description"
                value={newFeatureRequest.description}
                onChange={(e) => setNewFeatureRequest(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Jira Ticket"
                value={newFeatureRequest.jiraTicket}
                onChange={(e) => setNewFeatureRequest(prev => ({ ...prev, jiraTicket: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Importance"
                value={newFeatureRequest.importance}
                onChange={(e) => setNewFeatureRequest(prev => ({ ...prev, importance: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <DatePicker
                label="Due Date"
                value={newFeatureRequest.dueDate}
                onChange={(newValue) => setNewFeatureRequest(prev => ({ ...prev, dueDate: newValue }))}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                startIcon={<AddIcon />}
                onClick={addFeatureRequest}
                variant="contained"
              >
                Add Feature Request
              </Button>
            </Grid>
          </Grid>

          <List>
            {formData.featureRequests.map((request, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={request.description}
                  secondary={`Jira: ${request.jiraTicket} | Importance: ${request.importance} | Due: ${request.dueDate ? request.dueDate.format('YYYY-MM-DD') : 'Not set'}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => removeFeatureRequest(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Trouble Areas Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Trouble Areas
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={formData.troubleAreas}
            onChange={(e) => handleInputChange('troubleAreas', null, e.target.value)}
          />
        </Box>

        {/* Generate PDF Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={generatePDF}
          >
            Generate PDF
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OnboardingForm; 