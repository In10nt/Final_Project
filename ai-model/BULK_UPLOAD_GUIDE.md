# 📤 Bulk Dataset Upload Guide

## Overview
The Training UI now supports bulk uploading of training samples via CSV or JSON files. This allows you to add hundreds or thousands of samples at once instead of entering them one by one.

## 🚀 Quick Start

### Access the Feature
1. Open the Training UI: **http://localhost:5001**
2. Click on **"Training Data"** in the left sidebar
3. You'll see the **"Bulk Upload Dataset"** section at the top

## 📋 Supported Formats

### CSV Format
```csv
chest,waist,hip,height,size,gender,clothing_type
88.0,72.0,95.0,165.0,M,female,shirt
92.0,76.0,98.0,170.0,M,female,shirt
100.0,86.0,102.0,178.0,L,male,shirt
95.0,80.0,100.0,175.0,L,male,pants
```

**Required Columns:**
- `chest` - Chest measurement in cm
- `waist` - Waist measurement in cm
- `hip` - Hip measurement in cm
- `height` - Height in cm
- `size` - One of: XS, S, M, L, XL, XXL
- `gender` - Either: female, male
- `clothing_type` - e.g., shirt, pants, dress, jacket

### JSON Format
```json
[
  {
    "measurements": {
      "chest_cm": 88.0,
      "waist_cm": 72.0,
      "hip_cm": 95.0,
      "height_cm": 165.0
    },
    "actual_size": "M",
    "gender": "female",
    "clothing_type": "shirt"
  },
  {
    "measurements": {
      "chest_cm": 92.0,
      "waist_cm": 76.0,
      "hip_cm": 98.0,
      "height_cm": 170.0
    },
    "actual_size": "M",
    "gender": "female",
    "clothing_type": "shirt"
  }
]
```

## 📝 How to Use

### Method 1: Download Template
1. Click **"Download CSV Template"** button
2. Open the downloaded file in Excel or any text editor
3. Add your training data (keep the header row)
4. Save the file
5. Click **"Select File"** and choose your CSV
6. Click **"Upload Dataset"**

### Method 2: Create Your Own File
1. Create a new CSV or JSON file
2. Follow the format examples above
3. Add as many samples as you need
4. Upload via the interface

## ✅ Validation Rules

The system validates each sample:
- All measurements must be positive numbers
- Size must be one of: XS, S, M, L, XL, XXL
- Gender must be: female or male
- Invalid samples are automatically skipped
- You'll see how many samples were successfully added

## 🎯 Testing the Feature

### Quick Test with Template:
```bash
# 1. Download CSV template from the UI
# 2. The template already has 3 sample rows
# 3. Upload it directly to test
```

### Create Test Data:
Create a file named `test_data.csv`:
```csv
chest,waist,hip,height,size,gender,clothing_type
82.0,66.0,90.0,160.0,S,female,shirt
88.0,72.0,95.0,165.0,M,female,shirt
94.0,78.0,100.0,170.0,L,female,shirt
92.0,78.0,96.0,175.0,M,male,shirt
100.0,86.0,102.0,180.0,L,male,shirt
108.0,94.0,108.0,185.0,XL,male,shirt
```

## 📊 After Upload

Once uploaded successfully:
1. You'll see a success message with the count
2. The samples appear in the "All Training Samples" list
3. The dashboard stats update automatically
4. You can now train your model with the new data

## 🎓 For Lecturer Demonstration

**Show this workflow:**
1. "I can add training data in bulk using CSV files"
2. Download the template to show the format
3. Open it in Excel/Notepad to show the structure
4. Upload the file
5. Show the success message
6. Navigate to Dashboard to show updated sample count
7. Click "Start Model Training" to train with the uploaded data
8. Show the training progress and results

**Key Points to Mention:**
- Supports both CSV and JSON formats
- Validates data automatically
- Skips invalid entries
- Can upload hundreds or thousands of samples at once
- Much faster than manual entry
- Professional data science workflow

## 🔧 Troubleshooting

**"No file selected" error:**
- Make sure you clicked "Choose File" and selected a file

**"Unsupported file format" error:**
- File must end with .csv or .json
- Check the file extension

**"0 samples added" message:**
- Check your data format matches the examples
- Ensure all required fields are present
- Verify size values are: XS, S, M, L, XL, XXL
- Verify gender values are: female, male

**Some samples skipped:**
- Invalid rows are automatically skipped
- Check the format of skipped rows
- Ensure all measurements are positive numbers

## 💡 Tips

1. **Start Small**: Test with 5-10 samples first
2. **Use Template**: Download and modify the template
3. **Check Format**: Ensure your CSV has the correct headers
4. **Validate Data**: Make sure measurements are realistic
5. **Backup**: Keep a copy of your training data files

## 🎉 Success!

You now have a professional way to manage training data for your AI model. This feature makes it easy to:
- Import large datasets
- Share training data with team members
- Backup and restore training data
- Demonstrate professional ML workflows

---

**Training UI URL:** http://localhost:5001
**Current Status:** ✅ Running and Ready
