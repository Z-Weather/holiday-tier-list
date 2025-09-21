import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Chip,
  FormControlLabel,
  Switch,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { createTierList } from '../store/tierListSlice';
import TierListBuilder from '../components/TierListBuilder';

const steps = ['Basic Info', 'Build Tiers', 'Review & Publish'];

const TierListCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(state => state.tierList);
  const { isAuthenticated } = useSelector(state => state.auth);

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    isPublic: true,
    tiers: []
  });

  const [currentTag, setCurrentTag] = useState('');
  const [formErrors, setFormErrors] = useState({});

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isPublic' ? checked : value
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim().toLowerCase()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateBasicInfo = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }

    if (formData.description.length > 1000) {
      errors.description = 'Description cannot exceed 1000 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateBasicInfo()) {
      return;
    }

    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleTiersSave = (tierData) => {
    setFormData(prev => ({
      ...prev,
      tiers: tierData.tiers
    }));
    handleNext();
  };

  const handleSubmit = async () => {
    if (!validateBasicInfo()) {
      setActiveStep(0);
      return;
    }

    if (formData.tiers.length === 0) {
      setFormErrors({ tiers: 'Please create at least one tier' });
      setActiveStep(1);
      return;
    }

    try {
      const result = await dispatch(createTierList(formData)).unwrap();
      navigate(`/tier-list/${result._id}`);
    } catch (err) {
      console.error('Failed to create tier list:', err);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!formErrors.title}
              helperText={formErrors.title}
              sx={{ mb: 3 }}
              placeholder="My Holiday Tier List"
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
              sx={{ mb: 3 }}
              placeholder="Describe your holiday rankings..."
            />

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Add Tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="Press Enter to add tags"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isPublic}
                  onChange={handleChange}
                  name="isPublic"
                />
              }
              label="Make this tier list public"
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <TierListBuilder
              initialData={{ tiers: formData.tiers }}
              onSave={handleTiersSave}
            />
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Tier List
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                {formData.title}
              </Typography>
              {formData.description && (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formData.description}
                </Typography>
              )}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {formData.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary">
                {formData.isPublic ? 'Public' : 'Private'} • {formData.tiers.length} tiers
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom>
              Tier Preview
            </Typography>
            {formData.tiers.map((tier) => (
              <Box key={tier.id} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'stretch',
                    minHeight: 80,
                    border: '2px solid #e0e0e0',
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      width: 100,
                      backgroundColor: tier.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    {tier.name}
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      padding: 1,
                      gap: 1,
                      flexWrap: 'wrap'
                    }}
                  >
                    {tier.items.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          border: '1px solid #ddd',
                          borderRadius: 1,
                          padding: 1,
                          minWidth: 60,
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                          {item.emoji}
                        </Typography>
                        <Typography variant="caption" noWrap>
                          {item.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Create New Tier List
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>

          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isLoading}
                size="large"
              >
                {isLoading ? 'Creating...' : 'Create Tier List'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={activeStep === 1}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default TierListCreate;