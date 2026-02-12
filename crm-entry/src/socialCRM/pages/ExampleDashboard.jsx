import React, { useState } from 'react';
import { Card, StatsCard, Button, Table, Input, Textarea } from '../components/common';

/**
 * Example Dashboard showing how to use common components
 * This demonstrates the design system usage
 */
export default function ExampleDashboard() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  // Example table data
  const tableColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (value, row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="primary">Edit</Button>
          <Button size="sm" variant="error">Delete</Button>
        </div>
      )
    },
  ];

  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600">Welcome to your Social Media CRM</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Leads"
          value="1,234"
          change="+12.5%"
          trend="up"
          icon={<span className="text-2xl">📥</span>}
        />
        <StatsCard
          title="Active Forms"
          value="8"
          change="+2"
          trend="up"
          icon={<span className="text-2xl">📋</span>}
        />
        <StatsCard
          title="Conversion Rate"
          value="24.5%"
          change="-2.3%"
          trend="down"
          icon={<span className="text-2xl">📊</span>}
        />
        <StatsCard
          title="Total Posts"
          value="156"
          change="+5"
          trend="up"
          icon={<span className="text-2xl">📄</span>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Form Card */}
        <Card title="Create New Post">
          <div className="space-y-4">
            <Input
              label="Post Title"
              placeholder="Enter post title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Textarea
              label="Post Description"
              placeholder="Enter post description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
            <div className="flex gap-3">
              <Button variant="primary">Publish</Button>
              <Button variant="outline">Save Draft</Button>
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card title="Quick Actions">
          <div className="space-y-3">
            <Button variant="primary" className="w-full">
              Create New Campaign
            </Button>
            <Button variant="success" className="w-full">
              View Analytics
            </Button>
            <Button variant="secondary" className="w-full">
              Manage Settings
            </Button>
          </div>
        </Card>
      </div>

      {/* Table Card */}
      <Card title="Recent Users">
        <Table
          columns={tableColumns}
          data={tableData}
          striped
          hoverable
        />
      </Card>
    </div>
  );
}
