import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Share,
  Edit,
  Visibility,
  ArrowBack
} from '@mui/icons-material';
import { fetchTierListById, clearCurrentTierList } from '../store/tierListSlice';

const TierListView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentTierList, isLoading, error } = useSelector(state => state.tierList);

  useEffect(() => {
    if (id) {
      dispatch(fetchTierListById(id));
    }

    return () => {
      dispatch(clearCurrentTierList());
    };
  }, [id, dispatch]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentTierList.title,
          text: currentTierList.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!currentTierList) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">
          Tier list not found.
        </Alert>
      </Container>
    );
  }


  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Home
        </Button>

        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom>
                {currentTierList.title}
              </Typography>

              {currentTierList.description && (
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {currentTierList.description}
                </Typography>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Created by {currentTierList.creator || 'Anonymous'} on {formatDate(currentTierList.createdAt)}
                </Typography>
              </Box>

              {currentTierList.tags && currentTierList.tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {currentTierList.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" variant="outlined" />
                  ))}
                </Box>
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Visibility sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    {currentTierList.views || 0} views
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={handleShare} title="Share">
                <Share />
              </IconButton>
            </Box>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom>
              Tier Rankings
            </Typography>

            {currentTierList.tiers && currentTierList.tiers.length > 0 ? (
              currentTierList.tiers.map((tier) => (
                <Box key={tier.id} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'stretch',
                      minHeight: 100,
                      border: '2px solid #e0e0e0',
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      sx={{
                        width: 120,
                        backgroundColor: tier.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                      }}
                    >
                      {tier.name}
                    </Box>

                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        padding: 2,
                        gap: 2,
                        flexWrap: 'wrap',
                        backgroundColor: 'white'
                      }}
                    >
                      {tier.items && tier.items.length > 0 ? (
                        tier.items.map((item) => (
                          <Box
                            key={item.id}
                            sx={{
                              border: '1px solid #ddd',
                              borderRadius: 2,
                              padding: 2,
                              minWidth: 100,
                              textAlign: 'center',
                              backgroundColor: 'white',
                              boxShadow: 1
                            }}
                          >
                            <Typography variant="h5" sx={{ mb: 1 }}>
                              {item.emoji}
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {item.name}
                            </Typography>
                            {item.category && (
                              <Chip
                                label={item.category}
                                size="small"
                                variant="outlined"
                                sx={{ mt: 1, fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
                        ))
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: 'italic', ml: 2 }}
                        >
                          No items in this tier
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body1" color="text.secondary">
                No tiers available.
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default TierListView;