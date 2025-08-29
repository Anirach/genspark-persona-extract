# 🚀 Stagewise Integration Guide

## Overview
Stagewise is now integrated into your Persona Extraction project to provide workflow visualization and monitoring capabilities.

## 🎯 What You Get

### 1. **Workflow Visualization**
- Visual representation of all 17 extraction steps
- Real-time progress tracking
- Phase-based organization (initialization, discovery, collection, processing, analysis, validation)
- Step-by-step execution logs

### 2. **Dashboard Integration**
- New "Workflow Visualization" tab in your Dashboard
- Integrated with existing UI components
- Toast notifications for completion
- Progress bars and status indicators

### 3. **Standalone Stagewise UI**
- Dedicated workflow monitoring interface
- Available at `http://localhost:3100` when running
- Auto-detects your Vite dev server at `http://localhost:8080`

## 🎮 How to Use

### **Option 1: Run Both Servers Simultaneously**
```bash
npm run dev:with-stagewise
```
This starts both your Vite app (port 8080) and Stagewise (port 3100) together.

### **Option 2: Run Separately**
```bash
# Terminal 1: Start your React app
npm run dev

# Terminal 2: Start Stagewise
npm run stagewise
```

### **Option 3: Just Stagewise**
```bash
npm run stagewise
```

## 🎨 Using the Workflow Visualization

### **In Your React App** (`http://localhost:8080`)
1. Go to `/dashboard`
2. Click "Start Extraction" to create a run
3. Click the "Workflow Visualization" tab
4. Use the controls:
   - **Start**: Begin workflow execution
   - **Pause**: Pause current execution
   - **Reset**: Reset all steps to pending

### **In Stagewise UI** (`http://localhost:3100`)
1. Open the standalone interface
2. View your defined workflows
3. Monitor execution in real-time
4. Access detailed logs and metrics

## 📊 Features Available

### **Step Tracking**
- ✅ **Status Icons**: Pending, Running, Completed, Error
- 📊 **Progress Bars**: Real-time step progress
- ⏱️ **Duration Tracking**: Time each step takes
- 📝 **Logs**: Detailed execution logs per step

### **Phase Organization**
1. **Initialization** (1 step)
2. **Discovery** (3 steps)
3. **Collection** (2 steps) 
4. **Processing** (3 steps)
5. **Analysis** (4 steps)
6. **Validation** (4 steps)

### **Real-time Updates**
- Live progress updates
- Step completion notifications
- Overall workflow progress
- Error handling and display

## 🔧 Configuration

### **Stagewise Settings** (`stagewise.json`)
```json
{
  "port": 3100,                    // Stagewise UI port
  "appPort": 8080,                 // Your app port
  "workflowsDir": "./workflows",   // Workflow definitions
  "ui": {
    "title": "Persona Extraction Pipeline",
    "theme": "light",
    "autoRefresh": true
  }
}
```

### **Workflow Definition** (`workflows/persona-extraction.ts`)
- Complete 17-step pipeline definition
- Phase-based organization
- Input/output specifications
- Estimated durations

## 🔗 Integration Points

### **React Components**
- `StagewiseIntegration`: Main workflow component
- Embedded in Dashboard tabs
- Callbacks for completion and step updates

### **Event Handling**
```typescript
// Workflow completion callback
onWorkflowComplete={(result) => {
  if (result.success) {
    toast({ title: "Workflow Completed" });
  }
}}

// Step update callback
onStepUpdate={(step) => {
  console.log("Step updated:", step);
}}
```

## 🎯 Next Steps

### **Development Workflow**
1. Start with `npm run dev:with-stagewise`
2. Use React app for main interaction
3. Use Stagewise UI for detailed monitoring
4. Monitor both interfaces during development

### **Customization Options**
- Modify workflow definitions in `workflows/`
- Adjust Stagewise config in `stagewise.json`
- Customize React integration in `StagewiseIntegration.tsx`
- Add custom step implementations

### **Production Considerations**
- Stagewise is primarily for development/monitoring
- Can be disabled in production builds
- Workflow definitions can drive actual implementation
- Consider API integration for real workflow execution

## 🛠️ Troubleshooting

### **Common Issues**
1. **Port Conflicts**: Change ports in `stagewise.json`
2. **Workflow Not Loading**: Check `workflows/` directory
3. **Integration Errors**: Verify component imports
4. **Connection Issues**: Ensure both servers are running

### **Debug Mode**
```bash
# Run with debug logging
DEBUG=stagewise* npm run stagewise
```

## 📚 Resources

- **Stagewise Docs**: Check their documentation for advanced features
- **Workflow Files**: Located in `./workflows/`
- **Integration Code**: `src/components/Stagewise/`
- **Configuration**: `stagewise.json`

The integration provides a powerful way to visualize, monitor, and debug your persona extraction pipeline!
