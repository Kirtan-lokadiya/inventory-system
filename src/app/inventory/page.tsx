'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { Part, partsApi } from '@/lib/supabase';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';

export default function InventoryPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [formData, setFormData] = useState({
    part_name: '',
    description: '',
    quantity: 0,
    rate: 0,
    warehouse_location: '',
  });

  const router = useRouter();

  useEffect(() => {
    loadParts();
  }, []);

  const loadParts = async () => {
    try {
      const data = await partsApi.getAll();
      setParts(data);
    } catch (error) {
      toast.error('Failed to load parts');
    }
  };

  const handleSearch = async () => {
    try {
      if (searchQuery.trim()) {
        const data = await partsApi.searchByLocation(searchQuery);
        setParts(data);
      } else {
        loadParts();
      }
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleAdd = async () => {
    try {
      await partsApi.create(formData);
      toast.success('Part added successfully');
      setIsAddDialogOpen(false);
      loadParts();
      resetForm();
    } catch (error) {
      toast.error('Failed to add part');
    }
  };

  const handleEdit = async () => {
    if (!selectedPart) return;
    try {
      await partsApi.update(selectedPart.id, formData);
      toast.success('Part updated successfully');
      setIsEditDialogOpen(false);
      loadParts();
      resetForm();
    } catch (error) {
      toast.error('Failed to update part');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this part?')) return;
    try {
      await partsApi.delete(id);
      toast.success('Part deleted successfully');
      loadParts();
    } catch (error) {
      toast.error('Failed to delete part');
    }
  };

  const resetForm = () => {
    setFormData({
      part_name: '',
      description: '',
      quantity: 0,
      rate: 0,
      warehouse_location: '',
    });
    setSelectedPart(null);
  };

  const openEditDialog = (part: Part) => {
    setSelectedPart(part);
    setFormData({
      part_name: part.part_name,
      description: part.description || '',
      quantity: part.quantity,
      rate: part.rate,
      warehouse_location: part.warehouse_location || '',
    });
    setIsEditDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Add New Part
          </Button>
        </div>

        <div className="flex gap-4">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search parts by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </div>

        <Paper className="overflow-hidden">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Serial No.</TableCell>
                <TableCell>Part Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Rate (₹)</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parts.map((part) => (
                <TableRow key={part.id}>
                  <TableCell>{part.serial_number}</TableCell>
                  <TableCell>{part.part_name}</TableCell>
                  <TableCell>{part.description}</TableCell>
                  <TableCell>{part.quantity}</TableCell>
                  <TableCell>₹{part.rate.toFixed(2)}</TableCell>
                  <TableCell>{part.warehouse_location}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => openEditDialog(part)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(part.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* Add/Edit Dialog */}
        <Dialog
          open={isAddDialogOpen || isEditDialogOpen}
          onClose={() => {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            resetForm();
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {isAddDialogOpen ? 'Add New Part' : 'Edit Part'}
          </DialogTitle>
          <DialogContent>
            <div className="space-y-4 pt-4">
              <TextField
                fullWidth
                label="Part Name"
                value={formData.part_name}
                onChange={(e) =>
                  setFormData({ ...formData, part_name: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
              />
              <TextField
                fullWidth
                label="Rate (₹)"
                type="number"
                value={formData.rate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rate: parseFloat(e.target.value) || 0,
                  })
                }
              />
              <TextField
                fullWidth
                label="Warehouse Location"
                value={formData.warehouse_location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    warehouse_location: e.target.value,
                  })
                }
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={isAddDialogOpen ? handleAdd : handleEdit}
              variant="contained"
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAddDialogOpen ? 'Add' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Layout>
  );
} 