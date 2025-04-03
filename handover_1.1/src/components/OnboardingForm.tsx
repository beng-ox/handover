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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

interface KeyPlayer {
  name: string;
  focusArea: string;
  geographicLocation: string;
  kpis: string;
}

interface FeatureRequest {
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'New' | 'In progress' | 'Almost finished';
  dueDate: dayjs.Dayjs | null;
  ticketLink: string;
  jiraLink: string;
}

interface OpenIssue {
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'New' | 'In progress' | 'Almost finished';
  dueDate: dayjs.Dayjs | null;
}

interface FormData {
  accountName: string;
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
    multiToken: 'Yes' | 'No' | '';
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
  openIssues: OpenIssue[];
  betaFeatures: string;
  orgId: string;
  featureRequests: FeatureRequest[];
  troubleAreas: string;
}

type FormValue = string | string[] | KeyPlayer[] | FeatureRequest[] | OpenIssue[] | dayjs.Dayjs | null;

const OnboardingForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    accountName: '',
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
      multiToken: '',
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
    openIssues: [],
    betaFeatures: '',
    orgId: '',
    featureRequests: [],
    troubleAreas: '',
  });

  const [newKeyPlayer, setNewKeyPlayer] = useState<KeyPlayer>({
    name: '',
    focusArea: '',
    geographicLocation: '',
    kpis: '',
  });

  const [newFeatureRequest, setNewFeatureRequest] = useState<FeatureRequest>({
    description: '',
    priority: 'High',
    status: 'New',
    dueDate: null,
    ticketLink: '',
    jiraLink: '',
  });

  const handleInputChange = (
    field: keyof FormData | 'technicalStack' | 'goals',
    subField?: string,
    value: FormValue = ''
  ) => {
    if (field === 'technicalStack' && subField) {
      setFormData(prev => ({
        ...prev,
        technicalStack: {
          ...prev.technicalStack,
          [subField]: value
        }
      }));
    } else if (field === 'goals' && subField) {
      setFormData(prev => ({
        ...prev,
        goals: {
          ...prev.goals,
          [subField]: value as string
        }
      }));
    } else if (field === 'featureRequests') {
      setFormData(prev => ({
        ...prev,
        featureRequests: value as FeatureRequest[]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleKeyPlayerChange = (index: number, field: keyof KeyPlayer, value: string) => {
    const updatedKeyPlayers = [...formData.keyPlayers];
    updatedKeyPlayers[index] = {
      ...updatedKeyPlayers[index],
      [field]: value,
    };
    setFormData({ ...formData, keyPlayers: updatedKeyPlayers });
  };

  const addKeyPlayer = () => {
    setFormData({
      ...formData,
      keyPlayers: [...formData.keyPlayers, { name: '', focusArea: '', geographicLocation: '', kpis: '' }],
    });
  };

  const removeKeyPlayer = (index: number) => {
    setFormData({
      ...formData,
      keyPlayers: formData.keyPlayers.filter((_, i) => i !== index),
    });
  };

  const addFeatureRequest = () => {
    setFormData({
      ...formData,
      featureRequests: [...formData.featureRequests, {
        description: '',
        priority: 'High',
        status: 'New',
        dueDate: null,
        ticketLink: '',
        jiraLink: '',
      }],
    });
  };

  const removeFeatureRequest = (index: number) => {
    setFormData({
      ...formData,
      featureRequests: formData.featureRequests.filter((_, i) => i !== index),
    });
  };

  const handleFeatureRequestChange = (index: number, field: keyof FeatureRequest, value: any) => {
    const updatedRequests = [...formData.featureRequests];
    updatedRequests[index] = {
      ...updatedRequests[index],
      [field]: value,
    };
    setFormData({ ...formData, featureRequests: updatedRequests });
  };

  const addOpenIssue = () => {
    setFormData({
      ...formData,
      openIssues: [...formData.openIssues, { description: '', priority: 'High', status: 'New', dueDate: null }],
    });
  };

  const removeOpenIssue = (index: number) => {
    setFormData({
      ...formData,
      openIssues: formData.openIssues.filter((_, i) => i !== index),
    });
  };

  const handleOpenIssueChange = (index: number, field: keyof OpenIssue, value: string | dayjs.Dayjs | null) => {
    const updatedOpenIssues = [...formData.openIssues];
    updatedOpenIssues[index] = {
      ...updatedOpenIssues[index],
      [field]: value,
    };
    setFormData({ ...formData, openIssues: updatedOpenIssues });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPos = 20;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    const pageHeight = doc.internal.pageSize.height;
    const maxY = pageHeight - margin - 20; // Add extra buffer at bottom
    
    // Helper function for consistent bullet points - with TypeScript types
    const addBulletItem = (text: string, level: number = 0, indent: number = 5): void => {
      const bulletSymbol = level === 0 ? '•' : '-';
      const xPosition = margin + (level * indent);
      doc.text(`${bulletSymbol} ${text}`, xPosition, yPos);
      yPos += 7;
    };
    
    // Check if we need a new page before adding content
    const addPageIfNeeded = (additionalSpace: number = 0): void => {
      if (yPos + additionalSpace > maxY) {
        doc.addPage();
        yPos = margin;
      }
    };
    
    // Helper for adding sections with proper spacing - with TypeScript types
    const addSection = (title: string, content: string = '', bulletLevel: number = 0): void => {
      // Check if we have enough space for at least the title and one line
      addPageIfNeeded(20);
      
      // Section title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin, yPos);
      yPos += 10; // CRITICAL: This spacing is needed between title and content
      
      // Section content
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      if (typeof content === 'string' && content.trim() !== '') {
        const contentLines = doc.splitTextToSize(content, contentWidth - (bulletLevel * 5));
        
        // Check if we need a new page for the content
        if (yPos + (contentLines.length * 7) > maxY) {
          doc.addPage();
          yPos = margin;
        }
        
        doc.text(contentLines, margin + (bulletLevel * 5), yPos);
        yPos += (contentLines.length * 7) + 5;
      }
      
      // Only add extra spacing if no content was provided (otherwise it's already added)
      if (content.trim() === '') {
        yPos += 5;
      }
    };
  
    // Timestamp
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const timestamp = new Date().toLocaleString();
    doc.text(`Generated on: ${timestamp}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 15;
  
    // Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Onboarding Form', pageWidth / 2, yPos, { align: 'center' });
    yPos += 20;
  
    // Account Name
    addSection('Account Information');
    addBulletItem(`Account Name: ${formData.accountName}`);
    yPos += 5;
  
    // Primary Business Case - Use the section content parameter
    addSection('Primary Business Case', formData.primaryBusinessCase);
  
    // Goals
    addSection('Goals');
    
    // Short-term goals with proper indentation
    addPageIfNeeded(30); // Ensure enough space for this section
    doc.setFont('helvetica', 'bold');
    addBulletItem('Short-term:');
    doc.setFont('helvetica', 'normal');
    const shortTermLines = doc.splitTextToSize(formData.goals.shortTerm, contentWidth - 15);
    
    // Check if we need a new page for the content
    if (yPos + (shortTermLines.length * 7) > maxY) {
      doc.addPage();
      yPos = margin;
    }
    
    doc.text(shortTermLines, margin + 10, yPos);
    yPos += (shortTermLines.length * 7) + 7;
    
    // Medium-term goals
    addPageIfNeeded(30);
    doc.setFont('helvetica', 'bold');
    addBulletItem('Medium-term:');
    doc.setFont('helvetica', 'normal');
    const mediumTermLines = doc.splitTextToSize(formData.goals.mediumTerm, contentWidth - 15);
    
    // Check if we need a new page for the content
    if (yPos + (mediumTermLines.length * 7) > maxY) {
      doc.addPage();
      yPos = margin;
    }
    
    doc.text(mediumTermLines, margin + 10, yPos);
    yPos += (mediumTermLines.length * 7) + 7;
    
    // Long-term goals
    addPageIfNeeded(30);
    doc.setFont('helvetica', 'bold');
    addBulletItem('Long-term:');
    doc.setFont('helvetica', 'normal');
    const longTermLines = doc.splitTextToSize(formData.goals.longTerm, contentWidth - 15);
    
    // Check if we need a new page for the content
    if (yPos + (longTermLines.length * 7) > maxY) {
      doc.addPage();
      yPos = margin;
    }
    
    doc.text(longTermLines, margin + 10, yPos);
    yPos += (longTermLines.length * 7) + 10;
  
    // Key Players with consistent formatting
    addSection('Key Players');
    formData.keyPlayers.forEach((player, index) => {
      // Check if we have enough space for this player's details
      addPageIfNeeded(35); // Estimate for player details height
      
      doc.setFont('helvetica', 'bold');
      addBulletItem(`Player ${index + 1}:`);
      doc.setFont('helvetica', 'normal');
      
      // Indent player details and use sub-bullets
      doc.text(`Name: ${player.name}`, margin + 10, yPos);
      yPos += 7;
      doc.text(`Focus Area: ${player.focusArea}`, margin + 10, yPos);
      yPos += 7;
      doc.text(`Geographic Location: ${player.geographicLocation}`, margin + 10, yPos);
      yPos += 7;
      doc.text(`KPIs: ${player.kpis}`, margin + 10, yPos);
      yPos += 15; // Increased spacing between players
    });
  
    // Technical Stack with consistent formatting
    addSection('Technical Stack');
    Object.entries(formData.technicalStack).forEach(([key, value]) => {
      if (!key.endsWith('Other')) {
        addPageIfNeeded(15); // Check if we have enough space
        
        const otherKey = `${key}Other`;
        const otherValue = formData.technicalStack[otherKey as keyof typeof formData.technicalStack];
        const displayValue = Array.isArray(value) 
          ? value.join(', ') + (value.includes('Other') && otherValue ? ` (${otherValue})` : '')
          : value;
        
        addBulletItem(`${key}: ${displayValue}`);
      }
    });
    yPos += 5;
  
    // Open Issues with consistent formatting
    addSection('Open Issues');
    formData.openIssues.forEach((issue, index) => {
      // Check if we have enough space for this issue's details
      addPageIfNeeded(35); // Estimate for issue details height
      
      doc.setFont('helvetica', 'bold');
      addBulletItem(`Issue ${index + 1}:`);
      doc.setFont('helvetica', 'normal');
      
      // Indent issue details
      doc.text(`Description: ${issue.description}`, margin + 10, yPos);
      yPos += 7;
      doc.text(`Priority: ${issue.priority}`, margin + 10, yPos);
      yPos += 7;
      doc.text(`Status: ${issue.status}`, margin + 10, yPos);
      yPos += 7;
      doc.text(`Due Date: ${issue.dueDate ? issue.dueDate.format('YYYY-MM-DD') : 'Not set'}`, margin + 10, yPos);
      yPos += 15; // Increased spacing between issues
    });
  
    // Beta Features - Add directly as content in addSection
    if (formData.betaFeatures && formData.betaFeatures.trim() !== '') {
      addSection('Beta Features of Interest', formData.betaFeatures);
    } else {
      addSection('Beta Features of Interest');
    }
  
    // Add space between sections
    yPos += 10;
  
    // Org ID
    addSection('Organization ID');
    if (formData.orgId && formData.orgId.trim() !== '') {
      addBulletItem(`${formData.orgId}`);
      yPos += 5;
    }
  
    // Feature Requests
    addSection('Feature Requests');
    formData.featureRequests.forEach((request, index) => {
      // Check if we have enough space for this request's details
      addPageIfNeeded(45); // Estimate for request details height
      
      doc.setFont('helvetica', 'bold');
      addBulletItem(`Request ${index + 1}:`);
      doc.setFont('helvetica', 'normal');
      
      // Indent request details
      doc.text(`Description: ${request.description}`, margin + 10, yPos);
      yPos += 7;
      doc.text(`Priority: ${request.priority}`, margin + 10, yPos);
      yPos += 7;
      doc.text(`Status: ${request.status}`, margin + 10, yPos);
      yPos += 7;
      doc.text(`Due Date: ${request.dueDate ? request.dueDate.format('YYYY-MM-DD') : 'Not set'}`, margin + 10, yPos);
      yPos += 7;
      doc.text(`Ticket Link: ${request.ticketLink}`, margin + 10, yPos);
      yPos += 7;
      doc.text(`Jira Link: ${request.jiraLink}`, margin + 10, yPos);
      yPos += 15; // Increased spacing between requests
    });
  
    // Trouble Areas - Add directly as content in addSection
    if (formData.troubleAreas && formData.troubleAreas.trim() !== '') {
      addSection('Trouble Areas', formData.troubleAreas);
    } else {
      addSection('Trouble Areas');
    }
  
    // Update the filename to use the account name and timestamp
    const timestampForFilename = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = formData.accountName 
      ? `${formData.accountName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_onboarding_${timestampForFilename}.pdf`
      : `onboarding_${timestampForFilename}.pdf`;
    
    doc.save(filename);
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

        {/* Account Name */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Account Name
          </Typography>
          <TextField
            fullWidth
            value={formData.accountName}
            onChange={(e) => handleInputChange('accountName', '', e.target.value)}
            placeholder="Enter account name"
          />
        </Box>

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
            onChange={(e) => handleInputChange('primaryBusinessCase', undefined, e.target.value)}
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
          {formData.keyPlayers.map((player, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Grid container spacing={2}>
                <Grid xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={player.name}
                    onChange={(e) => handleKeyPlayerChange(index, 'name', e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Focus Area"
                    value={player.focusArea}
                    onChange={(e) => handleKeyPlayerChange(index, 'focusArea', e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Geographic Location"
                    value={player.geographicLocation}
                    onChange={(e) => handleKeyPlayerChange(index, 'geographicLocation', e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="KPIs"
                    value={player.kpis}
                    onChange={(e) => handleKeyPlayerChange(index, 'kpis', e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={12}>
                  <IconButton edge="end" onClick={() => removeKeyPlayer(index)}>
                    Remove
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Button
            variant="contained"
            onClick={addKeyPlayer}
          >
            Add Key Player
          </Button>
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
                  <MenuItem value="GitLab Cloud">GitLab Cloud</MenuItem>
                  <MenuItem value="GitLab On-Prem">GitLab On-Prem</MenuItem>
                  <MenuItem value="BitBucket Cloud">BitBucket Cloud</MenuItem>
                  <MenuItem value="BitBucket On-Prem">BitBucket On-Prem</MenuItem>
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
                <InputLabel>Multi Token?</InputLabel>
                <Select
                  value={formData.technicalStack.multiToken}
                  onChange={(e) => handleInputChange('technicalStack', 'multiToken', e.target.value)}
                  input={<OutlinedInput label="Multi Token?" />}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
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

        {/* Open Issues Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Open Issues
          </Typography>
          {formData.openIssues.map((issue, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={issue.description}
                    onChange={(e) => handleOpenIssueChange(index, 'description', e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={issue.priority}
                      onChange={(e) => handleOpenIssueChange(index, 'priority', e.target.value)}
                      input={<OutlinedInput label="Priority" />}
                    >
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={issue.status}
                      onChange={(e) => handleOpenIssueChange(index, 'status', e.target.value)}
                      input={<OutlinedInput label="Status" />}
                    >
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="In progress">In progress</MenuItem>
                      <MenuItem value="Almost finished">Almost finished</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Due Date"
                      value={issue.dueDate}
                      onChange={(newValue) => handleOpenIssueChange(index, 'dueDate', newValue)}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid xs={12} sm={12}>
                  <IconButton edge="end" onClick={() => removeOpenIssue(index)}>
                    Remove
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Button
            variant="contained"
            onClick={addOpenIssue}
          >
            Add Open Issue
          </Button>
        </Box>

        {/* Beta Features Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Beta Features of Interest
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={formData.betaFeatures}
            onChange={(e) => handleInputChange('betaFeatures', '', e.target.value)}
          />
        </Box>

        {/* Org ID Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Organization ID
          </Typography>
          <TextField
            fullWidth
            value={formData.orgId}
            onChange={(e) => handleInputChange('orgId', '', e.target.value)}
          />
        </Box>

        {/* Feature Requests Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Feature Requests
          </Typography>
          {formData.featureRequests.map((request, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Description"
                    value={request.description}
                    onChange={(e) => handleFeatureRequestChange(index, 'description', e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={request.priority}
                      onChange={(e) => handleFeatureRequestChange(index, 'priority', e.target.value)}
                      input={<OutlinedInput label="Priority" />}
                    >
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={request.status}
                      onChange={(e) => handleFeatureRequestChange(index, 'status', e.target.value)}
                      input={<OutlinedInput label="Status" />}
                    >
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="In progress">In progress</MenuItem>
                      <MenuItem value="Almost finished">Almost finished</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={12} sm={3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Due Date"
                      value={request.dueDate}
                      onChange={(newValue) => handleFeatureRequestChange(index, 'dueDate', newValue)}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Ticket Link"
                    value={request.ticketLink}
                    onChange={(e) => handleFeatureRequestChange(index, 'ticketLink', e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Jira Link"
                    value={request.jiraLink}
                    onChange={(e) => handleFeatureRequestChange(index, 'jiraLink', e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={12}>
                  <IconButton edge="end" onClick={() => removeFeatureRequest(index)}>
                    Remove
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Button
            variant="contained"
            onClick={addFeatureRequest}
          >
            Add Feature Request
          </Button>
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
            onChange={(e) => handleInputChange('troubleAreas', undefined, e.target.value)}
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