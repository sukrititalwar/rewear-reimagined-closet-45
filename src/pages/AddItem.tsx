import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';
import { toast } from '@/components/ui/toast'; // Adjust this import to your toast implementation
import { itemsAPI } from '@/lib/localStorage';

const AddItem = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    description: '',
    category: '',
    size: '',
    type: '',
    condition: '',
    rentPrice: '',
    points: '',
    location: '',
    tags: ''
  });

  const categories = ['Tops', 'Bottoms', 'Dresses', 'Jackets', 'Shoes', 'Accessories', 'Sets'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
  const types = ['swap', 'rent', 'redeem'];
  const conditions = ['Excellent', 'Good', 'Fair', 'Needs TLC'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      tags: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Minimum image validation
    if (images.length < 4) {
      toast({
        title: "Please upload at least 4 images (front, back, sideways, worn) for the dress.",
        variant: "destructive"
      });
      return;
    }

    if (formData.title.trim().length === 0 || formData.description.trim().length < 10) {
      toast({
        title: "Please fill in the required fields and make sure the description has at least 10 characters.",
        variant: "destructive"
      });
      return;
    }

    // Construct item object
    const item = {
      ...formData,
      images,
      tags: formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0),
      status: 'pending',
      username: 'CurrentUser', // Replace with actual logged-in user info
      userId: 'currentUserId', // Replace with actual logged-in user id
      userAvatar: '',          // Replace with actual avatar
      minRating: 0,
      isWashed: false
    };

    try {
      itemsAPI.add(item);
      toast({
        title: "Item submitted for approval!",
        description: "Your listing will be visible once approved.",
        variant: "success"
      });
      navigate('/browse');
    } catch (error) {
      toast({
        title: "Failed to add item.",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Add New Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Vintage Denim Jacket"
          />
        </div>
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Levi's, Zara, H&M..."
          />
        </div>
        <div>
          <Label htmlFor="description">Description * (Minimum 10 characters)</Label>
          <Textarea
            id="description"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your item, its features, story, etc."
          />
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <select
            id="category"
            required
            className="w-full px-3 py-2 border rounded"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="size">Size *</Label>
          <select
            id="size"
            required
            className="w-full px-3 py-2 border rounded"
            value={formData.size}
            onChange={handleChange}
          >
            <option value="">Select Size</option>
            {sizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="type">Type *</Label>
          <select
            id="type"
            required
            className="w-full px-3 py-2 border rounded"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            {types.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="condition">Condition *</Label>
          <select
            id="condition"
            required
            className="w-full px-3 py-2 border rounded"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="">Select Condition</option>
            {conditions.map(condition => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </div>
        {formData.type === 'rent' && (
          <div>
            <Label htmlFor="rentPrice">Rent Price (per day, ₹)</Label>
            <Input
              id="rentPrice"
              type="number"
              min="0"
              value={formData.rentPrice}
              onChange={handleChange}
              placeholder="e.g. 200"
            />
          </div>
        )}
        {formData.type === 'redeem' && (
          <div>
            <Label htmlFor="points">Points Required</Label>
            <Input
              id="points"
              type="number"
              min="0"
              value={formData.points}
              onChange={handleChange}
              placeholder="e.g. 500"
            />
          </div>
        )}
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, Country"
          />
        </div>
        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={handleTagsChange}
            placeholder="#Summer, #Boho, #Party"
          />
        </div>
        <div>
          <Label>Images *</Label>
          <FileUpload
            minImages={4}
            maxImages={10}
            existingImages={images}
            onImagesChange={setImages}
          />
          <p className="text-xs mt-2 text-gray-500">
            Please upload images: <b>Front (cover)</b>, <b>Back</b>, <b>Sideways</b>, <b>Worn</b> (minimum 4, up to 10 total)
          </p>
        </div>
        <Button type="submit" className="w-full mt-4">Submit Listing</Button>
      </form>
    </div>
  );
};

export default AddItem;
