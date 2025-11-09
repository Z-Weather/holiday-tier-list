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
  StepLabel,
  Fade,
  Slide,
  Card,
  CardContent,
  Avatar,
  Grid
} from '@mui/material';
import {
  Add,
  ArrowBack,
  ArrowForward,
  Save,
  Title,
  Description,
  LocalOffer,
  Visibility,
  CheckCircle
} from '@mui/icons-material';
import { createTierList } from '../store/tierListSlice';
import TierListBuilder from '../components/TierListBuilder';

const steps = ['基础信息', '构建排行', '预览发布'];

const TierListCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector(state => state.tierList);

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    isPublic: true,
    tiers: [],
    creator: ''
  });

  const [currentTag, setCurrentTag] = useState('');
  const [formErrors, setFormErrors] = useState({});

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
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="创建者名称"
                  name="creator"
                  value={formData.creator}
                  onChange={handleChange}
                  placeholder="您的名称（可选）"
                  InputProps={{
                    startAdornment: <Title sx={{ mr: 1, color: 'action.active' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main'
                      }
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="排行榜标题"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!formErrors.title}
                  helperText={formErrors.title || '请输入一个吸引人的标题'}
                  placeholder="我的排行榜"
                  required
                  InputProps={{
                    startAdornment: <Title sx={{ mr: 1, color: 'action.active' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      '&:hover fieldset': {
                        borderColor: 'primary.main'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main'
                      }
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="描述说明"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description || '详细描述您的排行榜内容（可选）'}
                  placeholder="介绍一下这个排行榜的特色..."
                  InputProps={{
                    startAdornment: <Description sx={{ mr: 1, mt: 1, color: 'action.active' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main'
                      }
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    p: 3,
                    backgroundColor: 'rgba(102, 126, 234, 0.05)',
                    borderColor: 'rgba(102, 126, 234, 0.2)'
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <LocalOffer />
                    添加标签
                  </Typography>

                  <TextField
                    fullWidth
                    label="输入标签"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="按回车键添加标签"
                    size="small"
                    sx={{ mb: 2 }}
                  />

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag)}
                        color="primary"
                        variant="filled"
                        sx={{
                          borderRadius: 1,
                          fontSize: '0.875rem'
                        }}
                      />
                    ))}
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    添加标签有助于其他用户发现您的排行榜
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    p: 3,
                    backgroundColor: 'rgba(76, 175, 80, 0.05)',
                    borderColor: 'rgba(76, 175, 80, 0.2)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Visibility sx={{ color: 'success.main' }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          公开排行榜
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          其他用户可以查看和搜索到您的排行榜
                        </Typography>
                      </Box>
                    </Box>

                    <Switch
                      checked={formData.isPublic}
                      onChange={handleChange}
                      name="isPublic"
                      size="large"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: 'success.main'
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: 'success.main'
                        }
                      }}
                    />
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <TierListBuilder
              initialData={formData.tiers.length > 0 ? { tiers: formData.tiers } : null}
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
    <Box sx={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Fade in timeout={600}>
          <Paper
            elevation={12}
            sx={{
              p: { xs: 3, md: 6 },
              mt: 4,
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              boxShadow: '0 16px 40px rgba(0,0,0,0.1)'
            }}
          >
            {/* 标题区域 */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}
              >
                🏆 创建新的排行榜
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: '600px', mx: 'auto' }}
              >
                跟随���单的步骤，创建属于你的个性化排行榜，支持多模板和自定义项目
              </Typography>
            </Box>

            {/* 步骤指示器 */}
            <Box sx={{ mb: 6 }}>
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                  '& .MuiStepLabel-root .Mui-active .MuiStepIcon-text': {
                    fill: 'white',
                    fontSize: '1rem'
                  },
                  '& .MuiStepLabel-root .Mui-completed .MuiStepIcon-text': {
                    fill: 'white',
                    fontSize: '1rem'
                  }
                }}
              >
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label': {
                          fontWeight: activeStep >= index ? 'bold' : 'normal',
                          color: activeStep >= index ? 'primary.main' : 'text.secondary'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {index === 0 && <Title fontSize="small" />}
                        {index === 1 && <Save fontSize="small" />}
                        {index === 2 && <CheckCircle fontSize="small" />}
                        {label}
                      </Box>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* 错误提示 */}
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 4 }}
                variant="filled"
              >
                {error}
              </Alert>
            )}

            {/* 步骤内容 */}
            <Slide in timeout={400} direction="left">
              <Box>
                {renderStepContent(activeStep)}
              </Box>
            </Slide>

            {/* 导航按钮 */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 6,
              pt: 4,
              borderTop: '1px solid rgba(0,0,0,0.08)'
            }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                disabled={activeStep === 0}
                onClick={handleBack}
                size="large"
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateX(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                上一步
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}
                >
                  第 {activeStep + 1} 步，共 {steps.length} 步
                </Typography>

                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    endIcon={isLoading ? undefined : <CheckCircle />}
                    onClick={handleSubmit}
                    disabled={isLoading}
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #4caf50 30%, #8bc34a 90%)',
                      boxShadow: '0 8px 24px rgba(76,175,80,0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #45a049 30%, #7cb342 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 32px rgba(76,175,80,0.4)'
                      },
                      transition: 'all 0.3s ease',
                      minWidth: '140px'
                    }}
                  >
                    {isLoading ? '创建中...' : '创建排行榜'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    endIcon={<ArrowForward />}
                    onClick={handleNext}
                    disabled={activeStep === 1 && !validateBasicInfo()}
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      boxShadow: '0 8px 24px rgba(102,126,234,0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 32px rgba(102,126,234,0.4)'
                      },
                      transition: 'all 0.3s ease',
                      minWidth: '120px'
                    }}
                  >
                    下一步
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default TierListCreate;