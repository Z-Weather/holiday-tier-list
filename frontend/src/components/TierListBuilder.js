import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  DragIndicator
} from '@mui/icons-material';

const defaultHolidays = [
  { id: 'christmas', name: 'Christmas', emoji: '🎄', category: 'religious' },
  { id: 'newyear', name: 'New Year', emoji: '🎉', category: 'cultural' },
  { id: 'halloween', name: 'Halloween', emoji: '🎃', category: 'cultural' },
  { id: 'thanksgiving', name: 'Thanksgiving', emoji: '🦃', category: 'cultural' },
  { id: 'easter', name: 'Easter', emoji: '🐰', category: 'religious' },
  { id: 'valentine', name: "Valentine's Day", emoji: '💕', category: 'cultural' },
  { id: 'independence', name: 'Independence Day', emoji: '🇺🇸', category: 'national' },
  { id: 'stpatrick', name: "St. Patrick's Day", emoji: '🍀', category: 'cultural' },
  { id: 'birthday', name: 'Your Birthday', emoji: '🎂', category: 'personal' },
  { id: 'memorial', name: 'Memorial Day', emoji: '🇺🇸', category: 'national' },
  { id: 'labor', name: 'Labor Day', emoji: '⚒️', category: 'national' },
  { id: 'mothers', name: "Mother's Day", emoji: '💐', category: 'cultural' },
  { id: 'fathers', name: "Father's Day", emoji: '👔', category: 'cultural' },
  { id: 'groundhog', name: 'Groundhog Day', emoji: '🦫', category: 'cultural' }
];

const defaultTiers = [
  { id: 'S', name: 'S Tier', color: '#ff6b35', items: [] },
  { id: 'A', name: 'A Tier', color: '#f7931e', items: [] },
  { id: 'B', name: 'B Tier', color: '#ffd100', items: [] },
  { id: 'C', name: 'C Tier', color: '#90ee90', items: [] },
  { id: 'D', name: 'D Tier', color: '#87ceeb', items: [] },
  { id: 'F', name: 'F Tier', color: '#ff6b6b', items: [] }
];

const TierListBuilder = ({ initialData, onSave }) => {
  const [tiers, setTiers] = useState(initialData?.tiers || defaultTiers);
  const [availableItems, setAvailableItems] = useState(defaultHolidays);
  const [newItemDialog, setNewItemDialog] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', emoji: '🎉', category: 'other' });

  useEffect(() => {
    if (initialData?.tiers) {
      const usedItemIds = initialData.tiers.flatMap(tier => tier.items.map(item => item.id));
      setAvailableItems(defaultHolidays.filter(item => !usedItemIds.includes(item.id)));
    }
  }, [initialData]);

  const handleDragEnd = (result) => {
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
      category: newItem.category
    };

    setAvailableItems([...availableItems, customItem]);
    setNewItem({ name: '', emoji: '🎉', category: 'other' });
    setNewItemDialog(false);
  };

  const handleSave = () => {
    onSave({ tiers });
  };

  const TierRow = ({ tier, index: tierIndex }) => (
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

        <Droppable droppableId={tier.id} direction="horizontal">
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                padding: 1,
                backgroundColor: snapshot.isDraggingOver ? '#f5f5f5' : 'white',
                minHeight: 96,
                gap: 1,
                flexWrap: 'wrap'
              }}
            >
              {tier.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        backgroundColor: snapshot.isDragging ? '#e3f2fd' : 'white',
                        border: '1px solid #ddd',
                        borderRadius: 1,
                        padding: 1,
                        minWidth: 80,
                        textAlign: 'center',
                        cursor: 'grab',
                        '&:active': {
                          cursor: 'grabbing'
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                        {item.emoji}
                      </Typography>
                      <Typography variant="caption" noWrap>
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Drag holidays to rank them in tiers
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Available Holidays
          </Typography>
          <Droppable droppableId="available-items" direction="horizontal">
            {(provided, snapshot) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  p: 2,
                  backgroundColor: snapshot.isDraggingOver ? '#f5f5f5' : '#fafafa',
                  borderRadius: 2,
                  border: '2px dashed #ddd',
                  minHeight: 80,
                  alignItems: 'flex-start',
                  alignContent: 'flex-start'
                }}
              >
                {availableItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          backgroundColor: snapshot.isDragging ? '#e3f2fd' : 'white',
                          border: '1px solid #ddd',
                          borderRadius: 1,
                          padding: 1,
                          minWidth: 80,
                          textAlign: 'center',
                          cursor: 'grab',
                          '&:active': {
                            cursor: 'grabbing'
                          }
                        }}
                      >
                        <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                          {item.emoji}
                        </Typography>
                        <Typography variant="caption" noWrap>
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

          <Button
            startIcon={<Add />}
            onClick={() => setNewItemDialog(true)}
            sx={{ mt: 1 }}
          >
            Add Custom Holiday
          </Button>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Tier Rankings
          </Typography>
          {tiers.map((tier, index) => (
            <TierRow key={tier.id} tier={tier} index={index} />
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="contained" onClick={handleSave} size="large">
            Save Tier List
          </Button>
        </Box>

        <Dialog open={newItemDialog} onClose={() => setNewItemDialog(false)}>
          <DialogTitle>Add Custom Holiday</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Holiday Name"
              fullWidth
              variant="outlined"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Emoji"
              fullWidth
              variant="outlined"
              value={newItem.emoji}
              onChange={(e) => setNewItem({ ...newItem, emoji: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              margin="dense"
              label="Category"
              fullWidth
              variant="outlined"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="national">National</option>
              <option value="religious">Religious</option>
              <option value="cultural">Cultural</option>
              <option value="seasonal">Seasonal</option>
              <option value="personal">Personal</option>
              <option value="other">Other</option>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewItemDialog(false)}>Cancel</Button>
            <Button onClick={handleAddCustomItem} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DragDropContext>
  );
};

export default TierListBuilder;