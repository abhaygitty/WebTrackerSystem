const listItems = [
  {
    depth: 0,
    children: [1,2,3],
    disabled: false,
    title: 'root'
  },
  {
    depth: 1,
    parentIndex: 0,
    disabled: false,
    title: 'Clients',
    content: 'Content of Clients',
    route: '/clients'
  },
  {
    depth: 1,
    parentIndex: 0,
    disabled: false,
    title: 'Jobs',
    content: 'Content of Jobs',
    route: '/jobs'
  },
  {
    depth: 1,
    parentIndex: 0,
    disabled: false,
    children: [4, 5],
    title: 'Time'
  },
  {
    depth: 2,
    parentIndex: 3,
    disabled: false,
    title: 'Enter Times',
    content: 'Content of Enter Times',
    route: '/entertimes'
  },
  {
    depth: 2,
    parentIndex: 3,
    disabled: false,
    title: 'Rollover Minutes',
    content: 'Content of Rollover Minutes',
    route: '/rollover'
  },
  {
    depth: 1,
    parentIndex: 0,
    disabled: false,
    title: 'Reports',
    content: 'Content of Reports'
  },
  {
    depth: 1,
    parentIndex: 0,
    disabled: false,
    title: 'Known Issues',
    content: 'Content of Known Issues',
    route: '/issues'
  },
  {
    depth: 1,
    parentIndex: 0,
    disabled: false,
    title: 'Staff',
    content: 'Content of Staff',
    route: '/staff'
  },
  {
    depth: 1,
    parentIndex: 0,
    disabled: false,
    title: 'Modules',
    content: 'Content of Modules',
    route: '/modules'
  },
  {
    depth: 1,
    parentIndex: 0,
    disabled: false,
    title: 'Versions',
    content: 'Content of Versions',
    route: '/versions'
  },
  {
    depth: 1,
    parentIndex: 0,
    disabled: false,
    title: 'Options',
    content: 'Content of Options',
    route: '/options'
  },
  {
    depth: 1,
    parentIndex: 0,
    disabled: true,
    title: 'Methods',
    content: 'Content of Methods',
    route: '/methods'
  },
];

export {listItems};
