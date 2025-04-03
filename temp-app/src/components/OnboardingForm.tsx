import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Theme } from '@mui/material/styles';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Dayjs } from 'dayjs';

interface KeyPlayer {
  name: string;
  focus: string;
  geo: string;
  kpis: string;
}

interface FeatureRequest {
  description: string;
  priority: string;
  status: string;
  dueDate: Dayjs | null;
}

interface FormData {
  primaryBusinessCase: string;
  goals: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
  keyPlayers: KeyPlayer[];
  technicalStack: {
    sourceControl: string[];
    sourceControlOther: string;
    ciCd: string[];
    ciCdOther: string;
    registry: string[];
    registryOther: string;
    cloudDeployment: string[];
    cloudDeploymentOther: string;
    kubernetes: string[];
    kubernetesOther: string;
    projectManagement: string[];
    projectManagementOther: string;
    devAlerts: string[];
    devAlertsOther: string;
  };
  featureRequests: FeatureRequest[];
  troubleAreas: string;
}

type FormValue = string | Dayjs | null;

const OnboardingForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    primaryBusinessCase: '',
    goals: {
      shortTerm: '',
      mediumTerm: '',
      longTerm: '',
    },
    keyPlayers: [],
    technicalStack: {
      sourceControl: [],
      sourceControlOther: '',
      ciCd: [],
      ciCdOther: '',
      registry: [],
      registryOther: '',
      cloudDeployment: [],
      cloudDeploymentOther: '',
      kubernetes: [],
      kubernetesOther: '',
      projectManagement: [],
      projectManagementOther: '',
      devAlerts: [],
      devAlertsOther: '',
    },
    featureRequests: [],
    troubleAreas: '',
  });

  const [newKeyPlayer, setNewKeyPlayer] = useState<KeyPlayer>({
    name: '',
    focus: '',
    geo: '',
    kpis: '',
  });

  const [newFeatureRequest, setNewFeatureRequest] = useState<FeatureRequest>({
    description: '',
    priority: '',
    status: '',
    dueDate: null,
  });

  const handleInputChange = (
    section: keyof FormData,
    field: string | null,
    value: FormValue
  ) => {
    setFormData(prev => {
      const currentValue = prev[section];
      if (field === null) {
        return {
          ...prev,
          [section]: value
        };
      }
      if (typeof currentValue === 'object') {
        return {
          ...prev,
          [section]: {
            ...(currentValue as Record<string, FormValue>),
            [field]: value
          }
        };
      }
      return {
        ...prev,
        [section]: value
      };
    });
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

  const removeKeyPlayer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyPlayers: prev.keyPlayers.filter((_, i) => i !== index)
    }));
  };

  const addFeatureRequest = () => {
    if (newFeatureRequest.description.trim()) {
      setFormData(prev => ({
        ...prev,
        featureRequests: [...prev.featureRequests, { ...newFeatureRequest }]
      }));
      setNewFeatureRequest({
        description: '',
        priority: '',
        status: '',
        dueDate: null,
      });
    }
  };

  const removeFeatureRequest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      featureRequests: prev.featureRequests.filter((_, i) => i !== index)
    }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPos = 10;

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
    doc.text('Short-term Goals:', 10, yPos);
    yPos += 7;
    doc.text(formData.goals.shortTerm, 10, yPos);
    yPos += 10;
    doc.text('Medium-term Goals:', 10, yPos);
    yPos += 7;
    doc.text(formData.goals.mediumTerm, 10, yPos);
    yPos += 10;
    doc.text('Long-term Goals:', 10, yPos);
    yPos += 7;
    doc.text(formData.goals.longTerm, 10, yPos);
    yPos += 10;

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
      if (key.endsWith('Other')) return; // Skip the "Other" fields as they're handled below
      
      const values = value as string[];
      const otherKey = `${key}Other` as keyof FormData['technicalStack'];
      const otherValue = formData.technicalStack[otherKey] as string;
      
      let displayValue = values.join(', ');
      if (values.includes('Other') && otherValue) {
        displayValue = displayValue.replace('Other', `Other (${otherValue})`);
      }
      
      doc.text(`${key}: ${displayValue}`, 10, yPos);
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
      doc.text(`Priority: ${request.priority}`, 10, yPos);
      yPos += 7;
      doc.text(`Status: ${request.status}`, 10, yPos);
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

  const handleMultiSelectChange = (
    field: keyof FormData['technicalStack'],
    value: string[]
  ) => {
    setFormData(prev => ({
      ...prev,
      technicalStack: {
        ...prev.technicalStack,
        [field]: value
      }
    }));
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
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Short-term Goals"
                multiline
                rows={2}
                value={formData.goals.shortTerm}
                onChange={(e) => handleInputChange('goals', 'shortTerm', e.target.value)}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Medium-term Goals"
                multiline
                rows={2}
                value={formData.goals.mediumTerm}
                onChange={(e) => handleInputChange('goals', 'mediumTerm', e.target.value)}
              />
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Long-term Goals"
                multiline
                rows={2}
                value={formData.goals.longTerm}
                onChange={(e) => handleInputChange('goals', 'longTerm', e.target.value)}
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
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={newKeyPlayer.name}
                onChange={(e) => setNewKeyPlayer(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Focus Area"
                value={newKeyPlayer.focus}
                onChange={(e) => setNewKeyPlayer(prev => ({ ...prev, focus: e.target.value }))}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Geographic Location"
                value={newKeyPlayer.geo}
                onChange={(e) => setNewKeyPlayer(prev => ({ ...prev, geo: e.target.value }))}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="KPIs"
                value={newKeyPlayer.kpis}
                onChange={(e) => setNewKeyPlayer(prev => ({ ...prev, kpis: e.target.value }))}
              />
            </Grid>
            <Grid xs={12}>
              <Button
                variant="contained"
                onClick={addKeyPlayer}
              >
                Add Key Player
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
                    Remove
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
            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel>Source Control</InputLabel>
                <Select
                  multiple
                  value={formData.technicalStack.sourceControl}
                  onChange={(e) => handleMultiSelectChange('sourceControl', e.target.value as string[])}
                  input={<OutlinedInput label="Source Control" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="GitHub">GitHub</MenuItem>
                  <MenuItem value="GitLab">GitLab</MenuItem>
                  <MenuItem value="BitBucket Cloud">BitBucket Cloud</MenuItem>
                  <MenuItem value="BitBucket Stash">BitBucket Stash</MenuItem>
                  <MenuItem value="Azure Repos">Azure Repos</MenuItem>
                  <MenuItem value="Azure TFS">Azure TFS</MenuItem>
                  <MenuItem value="Gerrit">Gerrit</MenuItem>
                  <MenuItem value="AWS Code Commit">AWS Code Commit</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              {formData.technicalStack.sourceControl.includes('Other') && (
                <TextField
                  fullWidth
                  label="Other Source Control"
                  value={formData.technicalStack.sourceControlOther}
                  onChange={(e) => handleInputChange('technicalStack', 'sourceControlOther', e.target.value)}
                  sx={{ mt: 1 }}
                />
              )}
            </Grid>

            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel>CI/CD</InputLabel>
                <Select
                  multiple
                  value={formData.technicalStack.ciCd}
                  onChange={(e) => handleMultiSelectChange('ciCd', e.target.value as string[])}
                  input={<OutlinedInput label="CI/CD" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="Azure Pipelines">Azure Pipelines</MenuItem>
                  <MenuItem value="CircleCI">CircleCI</MenuItem>
                  <MenuItem value="Drone CI">Drone CI</MenuItem>
                  <MenuItem value="GitHub Actions">GitHub Actions</MenuItem>
                  <MenuItem value="GitLab CI/CD">GitLab CI/CD</MenuItem>
                  <MenuItem value="Jenkins">Jenkins</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              {formData.technicalStack.ciCd.includes('Other') && (
                <TextField
                  fullWidth
                  label="Other CI/CD"
                  value={formData.technicalStack.ciCdOther}
                  onChange={(e) => handleInputChange('technicalStack', 'ciCdOther', e.target.value)}
                  sx={{ mt: 1 }}
                />
              )}
            </Grid>

            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel>Registry</InputLabel>
                <Select
                  multiple
                  value={formData.technicalStack.registry}
                  onChange={(e) => handleMultiSelectChange('registry', e.target.value as string[])}
                  input={<OutlinedInput label="Registry" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="Amazon ECR">Amazon ECR</MenuItem>
                  <MenuItem value="Azure Container Registry">Azure Container Registry</MenuItem>
                  <MenuItem value="Docker Hub">Docker Hub</MenuItem>
                  <MenuItem value="GitLab Container Registry">GitLab Container Registry</MenuItem>
                  <MenuItem value="Google Artifact Registry">Google Artifact Registry</MenuItem>
                  <MenuItem value="Harbor">Harbor</MenuItem>
                  <MenuItem value="JFrog Artifactory">JFrog Artifactory</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              {formData.technicalStack.registry.includes('Other') && (
                <TextField
                  fullWidth
                  label="Other Registry"
                  value={formData.technicalStack.registryOther}
                  onChange={(e) => handleInputChange('technicalStack', 'registryOther', e.target.value)}
                  sx={{ mt: 1 }}
                />
              )}
            </Grid>

            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel>Cloud Deployment</InputLabel>
                <Select
                  multiple
                  value={formData.technicalStack.cloudDeployment}
                  onChange={(e) => handleMultiSelectChange('cloudDeployment', e.target.value as string[])}
                  input={<OutlinedInput label="Cloud Deployment" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="AWS">AWS</MenuItem>
                  <MenuItem value="Azure">Azure</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              {formData.technicalStack.cloudDeployment.includes('Other') && (
                <TextField
                  fullWidth
                  label="Other Cloud Deployment"
                  value={formData.technicalStack.cloudDeploymentOther}
                  onChange={(e) => handleInputChange('technicalStack', 'cloudDeploymentOther', e.target.value)}
                  sx={{ mt: 1 }}
                />
              )}
            </Grid>

            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel>Kubernetes</InputLabel>
                <Select
                  multiple
                  value={formData.technicalStack.kubernetes}
                  onChange={(e) => handleMultiSelectChange('kubernetes', e.target.value as string[])}
                  input={<OutlinedInput label="Kubernetes" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="AKS">AKS</MenuItem>
                  <MenuItem value="EKS">EKS</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              {formData.technicalStack.kubernetes.includes('Other') && (
                <TextField
                  fullWidth
                  label="Other Kubernetes"
                  value={formData.technicalStack.kubernetesOther}
                  onChange={(e) => handleInputChange('technicalStack', 'kubernetesOther', e.target.value)}
                  sx={{ mt: 1 }}
                />
              )}
            </Grid>

            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel>Project Management</InputLabel>
                <Select
                  multiple
                  value={formData.technicalStack.projectManagement}
                  onChange={(e) => handleMultiSelectChange('projectManagement', e.target.value as string[])}
                  input={<OutlinedInput label="Project Management" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="Jira">Jira</MenuItem>
                  <MenuItem value="Asana">Asana</MenuItem>
                  <MenuItem value="Azure Boards">Azure Boards</MenuItem>
                  <MenuItem value="Github Issues">Github Issues</MenuItem>
                  <MenuItem value="Monday">Monday</MenuItem>
                  <MenuItem value="ServiceNow">ServiceNow</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              {formData.technicalStack.projectManagement.includes('Other') && (
                <TextField
                  fullWidth
                  label="Other Project Management"
                  value={formData.technicalStack.projectManagementOther}
                  onChange={(e) => handleInputChange('technicalStack', 'projectManagementOther', e.target.value)}
                  sx={{ mt: 1 }}
                />
              )}
            </Grid>

            <Grid xs={12}>
              <FormControl fullWidth>
                <InputLabel>Dev Alerts</InputLabel>
                <Select
                  multiple
                  value={formData.technicalStack.devAlerts}
                  onChange={(e) => handleMultiSelectChange('devAlerts', e.target.value as string[])}
                  input={<OutlinedInput label="Dev Alerts" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="Slack">Slack</MenuItem>
                  <MenuItem value="Microsoft Teams">Microsoft Teams</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
              {formData.technicalStack.devAlerts.includes('Other') && (
                <TextField
                  fullWidth
                  label="Other Dev Alerts"
                  value={formData.technicalStack.devAlertsOther}
                  onChange={(e) => handleInputChange('technicalStack', 'devAlertsOther', e.target.value)}
                  sx={{ mt: 1 }}
                />
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Feature Requests Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Feature Requests
          </Typography>
          <Grid container spacing={2}>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newFeatureRequest.description}
                onChange={(e) => setNewFeatureRequest(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Priority"
                value={newFeatureRequest.priority}
                onChange={(e) => setNewFeatureRequest(prev => ({ ...prev, priority: e.target.value }))}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Status"
                value={newFeatureRequest.status}
                onChange={(e) => setNewFeatureRequest(prev => ({ ...prev, status: e.target.value }))}
              />
            </Grid>
            <Grid xs={12}>
              <DatePicker
                label="Due Date"
                value={newFeatureRequest.dueDate}
                onChange={(newValue) => setNewFeatureRequest(prev => ({ ...prev, dueDate: newValue }))}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            <Grid xs={12}>
              <Button
                variant="contained"
                onClick={addFeatureRequest}
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
                  secondary={`Priority: ${request.priority} | Status: ${request.status} | Due: ${request.dueDate ? request.dueDate.format('YYYY-MM-DD') : 'Not set'}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => removeFeatureRequest(index)}>
                    Remove
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