import { addDays, addMonths, formatISO } from '../utils/date';

export type PlanType = 'doveret' | 'premium' | 'enterprise';
export type SubscriberType = 'private' | 'business';

export interface Course {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  description: string;
}

export interface OrganizationUser {
  id: number;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'viewer';
  lastLogin: string;
}

export interface Group {
  id: number;
  name: string;
  organizationId: number;
  description?: string;
  managerId: number;
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  sector: string;
  city: string;
  users: OrganizationUser[];
  groups: Group[];
  courseIds: number[];
}

export interface Subscriber {
  id: number;
  organizationId: number;
  groupId: number;
  fullName: string;
  email: string;
  plan: PlanType;
  type: SubscriberType;
  phone?: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'trial' | 'paused';
}

export interface Subscription {
  id: number;
  subscriberId: number;
  courseId: number;
  startDate: string;
  endDate?: string;
}

const today = new Date();

export const courses: Course[] = [
  {
    id: 1,
    name: 'Full Stack Web Development',
    price: 4200,
    durationDays: 90,
    description: 'Hands-on program covering React, Node.js, and deployment best practices.'
  },
  {
    id: 2,
    name: 'Advanced Data Analytics',
    price: 3600,
    durationDays: 60,
    description: 'From data wrangling to dashboarding with BI tooling for business teams.'
  },
  {
    id: 3,
    name: 'AI for Product Leaders',
    price: 5200,
    durationDays: 45,
    description: 'Strategic adoption of machine learning and generative AI inside organizations.'
  },
  {
    id: 4,
    name: 'Cyber Awareness Essentials',
    price: 2100,
    durationDays: 30,
    description: 'Self-paced security fundamentals for onboarding new employees.'
  }
];

const organizationUsers: OrganizationUser[] = [
  {
    id: 100,
    name: 'Dana Levi',
    email: 'dana.levi@orion.io',
    role: 'owner',
    lastLogin: formatISO(addDays(today, -1))
  },
  {
    id: 101,
    name: 'Eitan Azulai',
    email: 'eitan.azulai@orion.io',
    role: 'manager',
    lastLogin: formatISO(addDays(today, -5))
  },
  {
    id: 200,
    name: 'Hadas Ben-Horin',
    email: 'hadas@neoview.ai',
    role: 'owner',
    lastLogin: formatISO(addDays(today, -2))
  },
  {
    id: 201,
    name: 'Motti Golan',
    email: 'motti@neoview.ai',
    role: 'viewer',
    lastLogin: formatISO(addDays(today, -12))
  }
];

export const organizations: Organization[] = [
  {
    id: 1,
    name: 'Orion Tech',
    slug: 'orion-tech',
    createdAt: formatISO(addMonths(today, -14)),
    sector: 'High Tech',
    city: 'Tel Aviv',
    users: organizationUsers.filter((u) => [100, 101].includes(u.id)),
    groups: [
      {
        id: 11,
        name: 'R&D Guild',
        organizationId: 1,
        description: 'Developers and DevOps engineers',
        managerId: 101
      },
      {
        id: 12,
        name: 'Customer Success',
        organizationId: 1,
        description: 'Account managers and onboarding specialists',
        managerId: 100
      }
    ],
    courseIds: [1, 2, 4]
  },
  {
    id: 2,
    name: 'NeoView Analytics',
    slug: 'neoview-analytics',
    createdAt: formatISO(addMonths(today, -6)),
    sector: 'Professional Services',
    city: 'Haifa',
    users: organizationUsers.filter((u) => [200, 201].includes(u.id)),
    groups: [
      {
        id: 21,
        name: 'Consulting',
        organizationId: 2,
        description: 'BI consultants and analysts',
        managerId: 200
      },
      {
        id: 22,
        name: 'Support',
        organizationId: 2,
        description: 'Technical support representatives',
        managerId: 201
      }
    ],
    courseIds: [2, 3]
  }
];

export const subscribers: Subscriber[] = [
  {
    id: 900,
    organizationId: 1,
    groupId: 11,
    fullName: 'Itay Mor',
    email: 'itay.mor@orion.io',
    plan: 'enterprise',
    type: 'business',
    phone: '+972-52-1234567',
    startDate: formatISO(addMonths(today, -3)),
    status: 'active'
  },
  {
    id: 901,
    organizationId: 1,
    groupId: 12,
    fullName: 'Romi Adar',
    email: 'romi.adar@orion.io',
    plan: 'premium',
    type: 'business',
    startDate: formatISO(addMonths(today, -1)),
    status: 'trial'
  },
  {
    id: 902,
    organizationId: 2,
    groupId: 21,
    fullName: 'Gil Yaari',
    email: 'gil.yaari@neoview.ai',
    plan: 'doveret',
    type: 'business',
    startDate: formatISO(addMonths(today, -5)),
    endDate: formatISO(addDays(today, 20)),
    status: 'active'
  },
  {
    id: 903,
    organizationId: 2,
    groupId: 22,
    fullName: 'Sivan Lavi',
    email: 'sivan.lavi@neoview.ai',
    plan: 'premium',
    type: 'business',
    startDate: formatISO(addMonths(today, -2)),
    status: 'paused'
  }
];

export const subscriptions: Subscription[] = [
  {
    id: 3000,
    subscriberId: 900,
    courseId: 1,
    startDate: formatISO(addMonths(today, -3))
  },
  {
    id: 3001,
    subscriberId: 900,
    courseId: 2,
    startDate: formatISO(addMonths(today, -2)),
    endDate: formatISO(addDays(today, 12))
  },
  {
    id: 3002,
    subscriberId: 901,
    courseId: 4,
    startDate: formatISO(addMonths(today, -1))
  },
  {
    id: 3003,
    subscriberId: 902,
    courseId: 2,
    startDate: formatISO(addMonths(today, -5))
  },
  {
    id: 3004,
    subscriberId: 903,
    courseId: 3,
    startDate: formatISO(addMonths(today, -2)),
    endDate: formatISO(addDays(today, 30))
  }
];
