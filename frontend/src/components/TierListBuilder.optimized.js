import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  DragIndicator,
  Image
} from '@mui/icons-material';

// 预设内容：人工智能
const defaultAI = [
  { id: 'chatgpt', name: 'ChatGPT', emoji: '🤖', category: 'ai' },
  { id: 'claude', name: 'Claude', emoji: '🧠', category: 'ai' },
  { id: 'gemini', name: 'Gemini', emoji: '💎', category: 'ai' },
  { id: 'gpt4', name: 'GPT-4', emoji: '⚡', category: 'ai' },
  { id: 'copilot', name: 'Copilot', emoji: '👨‍💻', category: 'ai' },
  { id: 'midjourney', name: 'Midjourney', emoji: '🎨', category: 'ai' },
  { id: 'dall-e', name: 'DALL-E', emoji: '🖼️', category: 'ai' },
  { id: 'stable-diffusion', name: 'Stable Diffusion', emoji: '🎆', category: 'ai' },
  { id: 'bard', name: 'Gemini', emoji: '🔮', category: 'ai' },
  { id: 'llama', name: 'Llama', emoji: '🦙', category: 'ai' },
  { id: 'palm', name: 'PaLM', emoji: '🌴', category: 'ai' },
  { id: 'gopher', name: 'Gopher', emoji: '🐹', category: 'ai' }
];

// 预设内容：中国法定节假日
const defaultHolidays = [
  { id: 'newyear', name: '元旦', emoji: '🎊', category: 'holiday' },
  { id: 'spring-festival', name: '春节', emoji: '🧧', category: 'holiday' },
  { id: 'qingming', name: '清明节', emoji: '🌸', category: 'holiday' },
  { id: 'labor-day', name: '劳动节', emoji: '⚒️', category: 'holiday' },
  { id: 'dragon-boat', name: '端午节', emoji: '🚣', category: 'holiday' },
  { id: 'mid-autumn', name: '中秋节', emoji: '🥮', category: 'holiday' },
  { id: 'national-day', name: '国庆节', emoji: '🇨🇳', category: 'holiday' }
];

// 预设内容：中国旅游省份
const defaultProvinces = [
  { id: 'beijing', name: '北京', emoji: '🏛️', category: 'province' },
  { id: 'shanghai', name: '上海', emoji: '🌆', category: 'province' },
  { id: 'guangdong', name: '广东', emoji: '🏝️', category: 'province' },
  { id: 'sichuan', name: '四川', emoji: '🐼', category: 'province' },
  { id: 'yunnan', name: '云南', emoji: '🌺', category: 'province' },
  { id: 'xizang', name: '西藏', emoji: '🏔️', category: 'province' },
  { id: 'xinjiang', name: '新疆', emoji: '🍇', category: 'province' },
  { id: 'jiangsu', name: '江苏', emoji: '🏯', category: 'province' },
  { id: 'zhejiang', name: '浙江', emoji: '🌊', category: 'province' },
  { id: 'shandong', name: '山东', emoji: '🏺', category: 'province' },
  { id: 'henan', name: '河南', emoji: '🏮', category: 'province' },
  { id: 'hubei', name: '湖北', emoji: '🌅', category: 'province' }
];

// 预设内容：大学
const defaultUniversities = [
  { id: 'peking', name: '北京大学', emoji: '🎓', category: 'university' },
  { id: 'tsinghua', name: '清华大学', emoji: '🏫', category: 'university' },
  { id: 'fudan', name: '复旦大学', emoji: '📚', category: 'university' },
  { id: 'jiaotong', name: '交通大学', emoji: '🚄', category: 'university' },
  { id: 'zhejiang', name: '浙江大学', emoji: '🏛️', category: 'university' },
  { id: 'nanjing', name: '南京大学', emoji: '🎯', category: 'university' },
  { id: 'wuhan', name: '武汉大学', emoji: '🌸', category: 'university' },
  { id: 'sun-yat-sen', name: '中山大学', emoji: '🌳', category: 'university' },
  { id: 'xiamen', name: '厦门大学', emoji: '🏝️', category: 'university' },
  { id: 'tongji', name: '同济大学', emoji: '🏗️', category: 'university' },
  { id: 'nankai', name: '南开大学', emoji: '🔮', category: 'university' },
  { id: 'tianjin', name: '天津大学', emoji: '🌃', category: 'university' }
];

const defaultTiers = [
  { id: 'hang', name: '夯', color: '#ff4757', items: [], description: '最强王者' },
  { id: 'top', name: '顶级', color: '#ffa502', items: [], description: '超凡大师' },
  { id: 'human', name: '人上人', color: '#ffd32c', items: [], description: '璀璨钻石' },
  { id: 'npc', name: 'NPC', color: '#7bed9f', items: [], description: '英勇黄铜' },
  { id: 'la', name: '拉', color: '#ff6348', items: [], description: '倔强青铜' }
];

const TierListBuilder = ({ initialData, onSave }) => {
  // 预设模板选择
  const [currentTemplate, setCurrentTemplate] = useState('ai'); // 'ai', 'holiday', 'province', 'university', 'custom'

  const [tiers, setTiers] = useState(() => {
    if (initialData?.tiers && initialData.tiers.length > 0) {
      return initialData.tiers;
    }
    return defaultTiers;
  });

  const [availableItems, setAvailableItems] = useState(defaultAI);
  const [newItemDialog, setNewItemDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    emoji: '⭐',
    category: 'custom',
    imageUrl: ''
  });

  // 根据当前模板更新可用项目
  const updateAvailableItems = (template) => {
    let items = [];
    switch (template) {
      case 'ai':
        items = defaultAI;
        break;
      case 'holiday':
        items = defaultHolidays;
        break;
      case 'province':
        items = defaultProvinces;
        break;
      case 'university':
        items = defaultUniversities;
        break;
      case 'custom':
        items = [];
        break;
      default:
        items = defaultAI;
    }

    // 如果有现有层级数据，排除已使用的项目
    if (initialData?.tiers && initialData.tiers.length > 0) {
      const usedItemIds = initialData.tiers.flatMap(tier => tier.items.map(item => item.id));
      items = items.filter(item => !usedItemIds.includes(item.id));
    }

    setAvailableItems(items);
  };

  useEffect(() => {
    updateAvailableItems(currentTemplate);
  }, [currentTemplate, initialData]);

  // 组件卸载时恢复页面滚动
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.userSelect = '';
    };
  }, []);

  const handleDragStart = () => {
    // 拖拽开始时禁用页面滚动
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.body.style.userSelect = 'none';
  };

  const handleDragEnd = (result) => {
    // 拖拽结束时恢复页面滚动
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    document.body.style.userSelect = '';

    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (source.droppableId === 'available-items') {
      const item = availableItems.find(item => item.id === draggableId);
      if (!item) return;

      const newAvailableItems = availableItems.filter(item => item.id !== draggableId);
      setAvailableItems(newAvailableItems);

      const destTierIndex = tiers.findIndex(tier => tier.id === destination.droppableId);
      const newTiers = [...tiers];
      newTiers[destTierIndex].items.splice(destination.index, 0, item);
      setTiers(newTiers);
    } else if (destination.droppableId === 'available-items') {
      const sourceTierIndex = tiers.findIndex(tier => tier.id === source.droppableId);
      const item = tiers[sourceTierIndex].items[source.index];

      const newTiers = [...tiers];
      newTiers[sourceTierIndex].items.splice(source.index, 1);
      setTiers(newTiers);

      const newAvailableItems = [...availableItems];
      newAvailableItems.splice(destination.index, 0, item);
      setAvailableItems(newAvailableItems);
    } else {
      const sourceTierIndex = tiers.findIndex(tier => tier.id === source.droppableId);
      const destTierIndex = tiers.findIndex(tier => tier.id === destination.droppableId);

      if (sourceTierIndex === destTierIndex) {
        const newTiers = [...tiers];
        const [removed] = newTiers[sourceTierIndex].items.splice(source.index, 1);
        newTiers[sourceTierIndex].items.splice(destination.index, 0, removed);
        setTiers(newTiers);
      } else {
        const newTiers = [...tiers];
        const [removed] = newTiers[sourceTierIndex].items.splice(source.index, 1);
        newTiers[destTierIndex].items.splice(destination.index, 0, removed);
        setTiers(newTiers);
      }
    }
  };

  const handleAddCustomItem = () => {
    if (!newItem.name.trim()) return;

    const customItem = {
      id: `custom-${Date.now()}`,
      name: newItem.name.trim(),
      emoji: newItem.emoji,
      category: newItem.category,
      imageUrl: newItem.imageUrl
    };

    setAvailableItems([...availableItems, customItem]);
    setNewItem({ name: '', emoji: '⭐', category: 'custom', imageUrl: '' });
    setNewItemDialog(false);
  };

  const handleTemplateChange = (template) => {
    setCurrentTemplate(template);
    setTiers(defaultTiers); // 重置层级
  };

  const handleSave = () => {
    onSave({ tiers });
  };

  const handleGenerateImage = async () => {
    try {
      // 动态导入 html2canvas
      const html2canvas = (await import('html2canvas')).default;

      // 找到要截图的元素 - 排行表格区域
      const element = document.getElementById('tierlist-content');
      if (!element) {
        alert('找不到排行表格内容，请稍后再试');
        return;
      }

      // 显示加载提示
      const loadingMessage = document.createElement('div');
      loadingMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 10000;
        font-size: 16px;
      `;
      loadingMessage.textContent = '正在生成图片，请稍候...';
      document.body.appendChild(loadingMessage);

      // 配置 html2canvas 选项
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2, // 提高图片质量
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      // 移除加载提示
      document.body.removeChild(loadingMessage);

      // 转换为 blob 并下载
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `my-list-ranking-${new Date().toISOString().slice(0, 10)}.png`;

        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 清理 URL 对象
        URL.revokeObjectURL(url);

        alert('✅ 排行榜图片已成功生成并下载！');
      }, 'image/png', 0.95);

    } catch (error) {
      console.error('生成图片失败:', error);
      alert('❌ 生成图片失败，请检查浏览器是否支持或稍后再试');
    }
  };

  const TierRow = ({ tier, index: tierIndex }) => (
    <Box key={tier.id} sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          minHeight: 120,
          border: '3px solid #333',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          backgroundColor: '#fff'
        }}
      >
        {/* 层级标签 */}
        <Box
          sx={{
            width: 120,
            backgroundColor: tier.color,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.6rem',
            padding: 1,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
            {tier.name}
          </Typography>
          {tier.description && (
            <Typography variant="caption" sx={{ fontSize: '0.65rem', opacity: 0.9, mt: 0.5 }}>
              {tier.description}
            </Typography>
          )}
        </Box>

        {/* 拖拽区域 */}
        <Droppable droppableId={tier.id}>
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 2,
                backgroundColor: snapshot.isDraggingOver ? '#e8f5e8' : '#fafafa',
                minHeight: 120,
                gap: 2,
                flexWrap: 'wrap',
                border: snapshot.isDraggingOver ? '2px dashed #4caf50' : '2px dashed #ccc',
                margin: 1,
                borderRadius: 2,
                transition: 'all 0.2s ease'
              }}
            >
              {tier.items.length === 0 && !snapshot.isDraggingOver && (
                <Box sx={{
                  color: '#999',
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  width: '100%'
                }}>
                  拖拽项目到这里
                </Box>
              )}

              {tier.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        backgroundColor: snapshot.isDragging ? '#fff3e0' : '#fff',
                        border: '2px solid',
                        borderColor: snapshot.isDragging ? '#ff9800' : '#ddd',
                        borderRadius: 2,
                        padding: 2,
                        width: '120px',
                        height: '120px',
                        minWidth: '120px',
                        maxWidth: '120px',
                        minHeight: '120px',
                        maxHeight: '120px',
                        textAlign: 'center',
                        cursor: 'grab',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: snapshot.isDragging ? '0 8px 16px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
                        transform: snapshot.isDragging ? 'scale(1.05)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                        userSelect: 'none',
                        position: 'relative',
                        zIndex: snapshot.isDragging ? 1000 : 1
                      }}
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginBottom: '4px'
                          }}
                        />
                      ) : (
                        <Typography variant="body1" style={{ fontSize: '2rem', lineHeight: 1, marginBottom: '4px' }}>
                          {item.emoji}
                        </Typography>
                      )}
                      <Typography variant="body2" style={{ fontSize: '0.75rem', fontWeight: 'medium', wordBreak: 'break-word', lineHeight: 1.2 }}>
                        {item.name}
                      </Typography>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </Box>
    </Box>
  );

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {/* 标题区域 */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
            🏆 My List 排行系统 🏆
          </Typography>

          {/* 模板选择 */}
          <Box sx={{ mb: 3, p: 3, backgroundColor: '#fff', borderRadius: 3, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
              🎯 选择排行模板
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Button
                variant={currentTemplate === 'ai' ? 'contained' : 'outlined'}
                onClick={() => handleTemplateChange('ai')}
                sx={{ mb: 1 }}
              >
                🤖 人工智能
              </Button>
              <Button
                variant={currentTemplate === 'holiday' ? 'contained' : 'outlined'}
                onClick={() => handleTemplateChange('holiday')}
                sx={{ mb: 1 }}
              >
                🎄 中国节假日
              </Button>
              <Button
                variant={currentTemplate === 'province' ? 'contained' : 'outlined'}
                onClick={() => handleTemplateChange('province')}
                sx={{ mb: 1 }}
              >
                🗺️ 旅游省份
              </Button>
              <Button
                variant={currentTemplate === 'university' ? 'contained' : 'outlined'}
                onClick={() => handleTemplateChange('university')}
                sx={{ mb: 1 }}
              >
                🎓 中国大学
              </Button>
              <Button
                variant={currentTemplate === 'custom' ? 'contained' : 'outlined'}
                onClick={() => handleTemplateChange('custom')}
                sx={{ mb: 1 }}
              >
                ✨ 自定义
              </Button>
            </Box>
          </Box>

          <Box sx={{ mb: 3, p: 3, backgroundColor: '#fff', borderRadius: 3, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
              📖 使用说明
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
              <strong>拖拽下方的项目到对应的层级中</strong>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              排序等级：夯 → 顶级 → 人上人 → NPC → 拉
            </Typography>
          </Box>
        </Box>

        {/* 排行表格 - 主要内容 */}
        <Box id="tierlist-content" sx={{ mb: 4, backgroundColor: '#fff', p: 3, borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4, color: '#333' }}>
            🏆 My List 排行表格
          </Typography>

          {tiers.map((tier, index) => (
            <TierRow key={tier.id} tier={tier} index={index} />
          ))}
        </Box>

        {/* 可用项目区域 */}
        <Box sx={{ mb: 4, backgroundColor: '#fff', p: 3, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
            📋 待分配的项目
          </Typography>

          <Droppable droppableId="available-items">
            {(provided, snapshot) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: '8px',
                  padding: '24px',
                  backgroundColor: snapshot.isDraggingOver ? '#e8f5e8' : '#fafafa',
                  borderRadius: '8px',
                  border: snapshot.isDraggingOver ? '3px solid #4caf50' : '3px dashed #9e9e9e',
                  minHeight: '120px',
                  alignItems: 'flex-start',
                  alignContent: 'flex-start',
                  transition: 'all 0.2s ease'
                }}
              >
                {availableItems.length === 0 && currentTemplate !== 'custom' && (
                  <Box sx={{
                    color: '#999',
                    fontSize: '1.1rem',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    width: '100%'
                  }}>
                    当前模板暂无项目，请选择其他模板或创建自定义项目
                  </Box>
                )}

                {availableItems.length === 0 && currentTemplate === 'custom' && (
                  <Box sx={{
                    color: '#999',
                    fontSize: '1.1rem',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    width: '100%'
                  }}>
                    暂无自定义项目，请添加项目开始排行
                  </Box>
                )}

                {availableItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          backgroundColor: snapshot.isDragging ? '#fff3e0' : '#fff',
                          border: '2px solid',
                          borderColor: snapshot.isDragging ? '#ff9800' : '#ddd',
                          borderRadius: 2,
                          padding: 2,
                          width: '120px',
                          height: '120px',
                          minWidth: '120px',
                          maxWidth: '120px',
                          minHeight: '120px',
                          maxHeight: '120px',
                          textAlign: 'center',
                          cursor: 'grab',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: snapshot.isDragging ? '0 6px 12px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.1)',
                          transform: snapshot.isDragging ? 'scale(1.05)' : 'scale(1)',
                          transition: 'all 0.2s ease',
                          userSelect: 'none',
                          position: 'relative',
                          zIndex: snapshot.isDragging ? 1000 : 1
                        }}
                      >
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              marginBottom: '4px'
                            }}
                          />
                        ) : (
                          <Typography variant="body1" style={{ fontSize: '2rem', lineHeight: 1, marginBottom: '4px' }}>
                            {item.emoji}
                          </Typography>
                        )}
                        <Typography variant="body2" style={{ fontSize: '0.75rem', fontWeight: 'medium', wordBreak: 'break-word', lineHeight: 1.2 }}>
                          {item.name}
                        </Typography>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            {currentTemplate === 'custom' && (
              <Button
                variant="contained"
                size="large"
                startIcon={<Add />}
                onClick={() => setNewItemDialog(true)}
                sx={{ px: 4, py: 1.5, fontSize: '1rem', mb: 2 }}
              >
                创建自定义项目
              </Button>
            )}

            <Button
              variant="contained"
              size="large"
              onClick={handleGenerateImage}
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                backgroundColor: '#4caf50',
                '&:hover': {
                  backgroundColor: '#45a049'
                }
              }}
            >
              📸 生成排行榜图片
            </Button>
          </Box>
        </Box>
      </Box>

      {/* 自定义项目对话框 */}
      <Dialog open={newItemDialog} onClose={() => setNewItemDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>创建自定义项目</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="项目名称"
            fullWidth
            variant="outlined"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Emoji图标"
            fullWidth
            variant="outlined"
            value={newItem.emoji}
            onChange={(e) => setNewItem({ ...newItem, emoji: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="图片URL（可选）"
            fullWidth
            variant="outlined"
            value={newItem.imageUrl}
            onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
            sx={{ mb: 2 }}
            helperText="可以上传图片链接，或留空使用emoji"
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>类别</InputLabel>
            <Select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              label="类别"
            >
              <MenuItem value="custom">自定义</MenuItem>
              <MenuItem value="ai">人工智能</MenuItem>
              <MenuItem value="holiday">节假日</MenuItem>
              <MenuItem value="province">旅游省份</MenuItem>
              <MenuItem value="university">大学</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewItemDialog(false)}>取消</Button>
          <Button onClick={handleAddCustomItem} variant="contained">添加</Button>
        </DialogActions>
      </Dialog>
    </DragDropContext>
  );
};

export default TierListBuilder;