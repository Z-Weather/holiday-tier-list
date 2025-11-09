import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  IconButton,
  Pagination
} from '@mui/material';
import {
  Visibility,
  Search,
  Add
} from '@mui/icons-material';
import { fetchTierLists } from '../store/tierListSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tierLists, pagination, isLoading } = useSelector(state => state.tierList);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTierLists({
      page: currentPage,
      limit: 12,
      sort: sortBy,
      search: searchTerm
    }));
  }, [dispatch, currentPage, sortBy, searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Holiday Tier Lists
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Create and share your holiday preference rankings
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => navigate('/create')}
          sx={{ mb: 4 }}
        >
          Get Started
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search tier lists..."
          value={searchTerm}
          onChange={handleSearch}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
          }}
          sx={{ minWidth: 300 }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            label="Sort by"
            onChange={handleSortChange}
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
            <MenuItem value="popular">Most Popular</MenuItem>
            <MenuItem value="views">Most Viewed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {isLoading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>Loading tier lists...</Typography>
        </Box>
      ) : tierLists.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No tier lists found
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/create')}
            sx={{ mt: 2 }}
          >
            Create Your First Tier List
          </Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {tierLists.map((tierList) => (
              <Grid item xs={12} sm={6} md={4} key={tierList._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => navigate(`/tier-list/${tierList._id}`)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
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
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {tierList.description || 'No description provided.'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        by {tierList.creator || 'Anonymous'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {tierList.tags?.slice(0, 3).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                      {tierList.tags?.length > 3 && (
                        <Chip
                          label={`+${tierList.tags.length - 3} more`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

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
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {pagination.pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.pages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Home;