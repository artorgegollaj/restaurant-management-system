export const configs = {
  roles: {
    title: 'Roles',
    endpoint: '/roles',
    fields: [
      { name: 'name', label: 'Name' }
    ]
  },

  menuCategories: {
    title: 'Menu Categories',
    endpoint: '/menu-categories',
    fields: [
      { name: 'name', label: 'Name' },
      { name: 'description', label: 'Description', type: 'textarea' }
    ]
  },

  menuItems: {
    title: 'Menu Items',
    endpoint: '/menu-items',
    fields: [
      { name: 'name', label: 'Name' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'price', label: 'Price', type: 'number', step: '0.01' },
      { name: 'image', label: 'Image URL' },
      { name: 'available', label: 'Available', type: 'checkbox', default: true }
    ],
    relations: {
      category: {
        label: 'Category',
        endpoint: '/menu-categories',
        display: (c) => c.name
      }
    }
  },

  tables: {
    title: 'Tables',
    endpoint: '/tables',
    fields: [
      { name: 'tableNumber', label: 'Table Number', type: 'number' },
      { name: 'capacity', label: 'Capacity', type: 'number' },
      { name: 'status', label: 'Status', default: 'FREE' }
    ]
  },

  reservations: {
    title: 'Reservations',
    endpoint: '/reservations',
    fields: [
      { name: 'customerName', label: 'Customer Name' },
      { name: 'phone', label: 'Phone' },
      { name: 'reservationDate', label: 'Date', type: 'date' },
      { name: 'reservationTime', label: 'Time', type: 'time' },
      { name: 'partySize', label: 'Party Size', type: 'number' },
      { name: 'status', label: 'Status', default: 'PENDING' }
    ],
    relations: {
      table: { label: 'Table', endpoint: '/tables', display: (t) => `#${t.tableNumber}` }
    }
  },

  orders: {
    title: 'Orders',
    endpoint: '/orders',
    fields: [
      { name: 'status', label: 'Status', default: 'PENDING' },
      { name: 'total', label: 'Total', type: 'number', step: '0.01' },
      { name: 'orderType', label: 'Order Type', default: 'DINE_IN' }
    ],
    relations: {
      table: { label: 'Table', endpoint: '/tables', display: (t) => `#${t.tableNumber}` }
    }
  },

  orderItems: {
    title: 'Order Items',
    endpoint: '/order-items',
    fields: [
      { name: 'quantity', label: 'Quantity', type: 'number' },
      { name: 'price', label: 'Price', type: 'number', step: '0.01' },
      { name: 'notes', label: 'Notes' }
    ],
    relations: {
      order: { label: 'Order', endpoint: '/orders', display: (o) => `Order #${o.id}` },
      menuItem: { label: 'Menu Item', endpoint: '/menu-items', display: (m) => m.name }
    }
  },

  staff: {
    title: 'Staff',
    endpoint: '/staff',
    fields: [
      { name: 'firstName', label: 'First Name' },
      { name: 'lastName', label: 'Last Name' },
      { name: 'position', label: 'Position' },
      { name: 'phone', label: 'Phone' },
      { name: 'shift', label: 'Shift' }
    ]
  },

  payments: {
    title: 'Payments',
    endpoint: '/payments',
    fields: [
      { name: 'amount', label: 'Amount', type: 'number', step: '0.01' },
      { name: 'method', label: 'Method' }
    ],
    relations: {
      order: { label: 'Order', endpoint: '/orders', display: (o) => `Order #${o.id}` }
    }
  },

  reviews: {
    title: 'Reviews',
    endpoint: '/reviews',
    fields: [
      { name: 'customerName', label: 'Customer Name' },
      { name: 'rating', label: 'Rating (1-5)', type: 'number' },
      { name: 'comment', label: 'Comment', type: 'textarea' },
      { name: 'reviewDate', label: 'Date', type: 'date' }
    ]
  },

  ingredients: {
    title: 'Ingredients',
    endpoint: '/ingredients',
    fields: [
      { name: 'name', label: 'Name' },
      { name: 'unit', label: 'Unit' },
      { name: 'quantityAvailable', label: 'Available', type: 'number', step: '0.01' },
      { name: 'minimumQuantity', label: 'Minimum', type: 'number', step: '0.01' }
    ]
  }
};
