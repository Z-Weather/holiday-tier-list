import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Edit,
  Add,
  Visibility,
  Favorite
} from '@mui/icons-material';
import { fetchUserTierLists } from '../store/tierListSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { userTierLists, isLoading } = useSelector(state => state.tierList);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    dispatch(fetchUserTierLists());
  }, [isAuthenticated, navigate, dispatch]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={user?.avatar}
                alt={user?.username}
                sx={{ width: 80, height: 80, mr: 3 }}
              />
              <Box>
                <Typography variant="h4" gutterBottom>
                  {user?.username}
                </Typography>
                {user?.bio && (
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {user.bio}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  Member since {formatDate(user?.createdAt)}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={() => navigate('/settings')}
            >
              Edit Profile
            </Button>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {user?.stats?.tierListsCreated || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tier Lists Created
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {user?.stats?.totalLikes || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Likes Received
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {user?.stats?.totalViews || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Views
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            My Tier Lists
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/create')}
          >
            Create New List
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : userTierLists.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              You haven't created any tier lists yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start creating your first holiday tier list to share your preferences!
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/create')}
            >
              Create Your First Tier List
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {userTierLists.map((tierList) => (
              <Grid item xs={12} sm={6} md={4} key={tierList._id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => navigate(`/tier-list/${tierList._id}`)}
                >
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" noWrap>
                      {tierList.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {tierList.description || 'No description provided.'}
                    </Typography>

                    {tierList.tags && tierList.tags.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {tierList.tags.slice(0, 2).map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                        {tierList.tags.length > 2 && (
                          <Chip
                            label={`+${tierList.tags.length - 2}`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Favorite fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="caption">
                            {tierList.stats?.totalLikes || 0}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Visibility fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="caption">
                            {tierList.views || 0}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        {formatDate(tierList.createdAt)}
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={tierList.isPublic ? 'Public' : 'Private'}
                        size="small"
                        color={tierList.isPublic ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Profile;