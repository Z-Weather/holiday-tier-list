import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Fade,
  Slide
} from '@mui/material';
import {
  Add,
  Timeline,
  Star,
  Share,
  Speed,
  EmojiEvents,
  Category,
  Image,
  TouchApp
} from '@mui/icons-material';

const HomeSimple = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Category />,
      title: '多模板排行',
      description: 'AI工具、节假日、旅游景点、大学排行等丰富模板',
      color: '#4caf50'
    },
    {
      icon: <TouchApp />,
      title: '拖拽排序',
      description: '直观的拖拽操作，轻松调整项目顺序',
      color: '#ff9800'
    },
    {
      icon: <Image />,
      title: '图片生成',
      description: '一键生成高清排行榜图片，方便分享保存',
      color: '#2196f3'
    },
    {
      icon: <Star />,
      title: '自定义项目',
      description: '支持添加自定义项目，打造个性化排行',
      color: '#e91e63'
    },
    {
      icon: <Share />,
      title: '轻松分享',
      description: '无需注册，创建即可分享给朋友',
      color: '#9c27b0'
    },
    {
      icon: <Speed />,
      title: '即时体验',
      description: '打开即用，无需等待，流畅的操作体验',
      color: '#00bcd4'
    }
  ];

  const templates = [
    { name: '🤖 人工智能', emoji: '🤖', color: '#ff4757' },
    { name: '🎄 中国节假日', emoji: '🎄', color: '#ffa502' },
    { name: '🗺️ 旅游省份', emoji: '🗺️', color: '#ffd32c' },
    { name: '🎓 中国大学', emoji: '🎓', color: '#7bed9f' },
    { name: '✨ 自定义', emoji: '✨', color: '#ff6348' }
  ];

  return (
    <Box sx={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* 英雄区块 */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h1"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                color: 'white',
                fontSize: { xs: '2.5rem', md: '4rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                mb: 2
              }}
            >
              🏆 My List
            </Typography>
            <Typography
              variant="h4"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 3,
                fontWeight: 300,
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}
            >
              你的专属排行系统
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              从游戏级排行到自定义评分，打造属于你的个性化榜单
              支持多模板选择、图片生成、一键分享
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => navigate('/create')}
              sx={{
                fontSize: '1.3rem',
                py: 2.5,
                px: 6,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #ff6b6b 30%, #ffd93d 90%)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ff5252 30%, #ffb300 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.3)'
                },
                transition: 'all 0.3s ease',
                mr: 2
              }}
            >
              创建排行
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/builder')}
              sx={{
                fontSize: '1.2rem',
                py: 2.5,
                px: 6,
                borderRadius: 3,
                borderColor: 'rgba(255,255,255,0.6)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  borderColor: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              直接开始
            </Button>
          </Box>
        </Fade>

        {/* 模板展示 */}
        <Slide in timeout={1000} direction="up">
          <Paper
            elevation={8}
            sx={{
              p: 4,
              mb: 8,
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                textAlign: 'center',
                mb: 4,
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              🎯 丰富模板
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {templates.map((template, index) => (
                <Grid item xs={6} md={2.4} key={index}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      p: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: `2px solid ${template.color}20`,
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                        border: `2px solid ${template.color}`
                      }
                    }}
                    onClick={() => navigate('/builder')}
                  >
                    <Typography
                      variant="h3"
                      sx={{ mb: 1 }}
                    >
                      {template.emoji}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'medium',
                        color: `${template.color}.dark`
                      }}
                    >
                      {template.name}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Slide>

        {/* 功能特色 */}
        <Slide in timeout={1200} direction="up">
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                textAlign: 'center',
                mb: 6,
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              ✨ 核心功能
            </Typography>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Fade in timeout={1400 + index * 100}>
                    <Card
                      elevation={4}
                      sx={{
                        height: '100%',
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 16px 32px rgba(0,0,0,0.2)',
                          background: 'white'
                        }
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                        <Avatar
                          sx={{
                            width: 64,
                            height: 64,
                            bgcolor: feature.color,
                            mx: 'auto',
                            mb: 2,
                            fontSize: '1.8rem'
                          }}
                        >
                          {feature.icon}
                        </Avatar>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            fontWeight: 'bold',
                            color: feature.color + '.dark'
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ lineHeight: 1.6 }}
                        >
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Slide>

        {/* 号召行动 */}
        <Slide in timeout={1600} direction="up">
          <Paper
            elevation={8}
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4
            }}
          >
            <EmojiEvents sx={{ fontSize: '4rem', color: '#ffd700', mb: 2 }} />
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
              开始创建你的排行榜
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: 4,
                maxWidth: '500px',
                mx: 'auto'
              }}
            >
              加入成千上万的用户，用最简单的方式创建、分享你的个人排行榜
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<Timeline />}
              onClick={() => navigate('/create')}
              sx={{
                fontSize: '1.2rem',
                py: 2,
                px: 5,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                boxShadow: '0 8px 24px rgba(102,126,234,0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(102,126,234,0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              立即开始
            </Button>
          </Paper>
        </Slide>
      </Container>
    </Box>
  );
};

export default HomeSimple;