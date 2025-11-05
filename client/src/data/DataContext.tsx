import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import {
  courses as initialCourses,
  organizations as initialOrganizations,
  subscribers as initialSubscribers,
  subscriptions as initialSubscriptions,
  Course,
  Organization,
  Subscriber,
  Subscription,
  Group,
  OrganizationUser
} from './mockData';

interface AddOrganizationInput {
  name: string;
  sector: string;
  city: string;
}

interface AddGroupInput {
  name: string;
  description?: string;
  managerName?: string;
  managerEmail?: string;
}

interface AddCourseInput {
  name: string;
  price: number;
  durationDays: number;
  description: string;
}

interface DataContextValue {
  organizations: Organization[];
  courses: Course[];
  subscribers: Subscriber[];
  subscriptions: Subscription[];
  addOrganization: (input: AddOrganizationInput) => void;
  addGroup: (organizationId: number, input: AddGroupInput) => void;
  addCourse: (input: AddCourseInput) => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

const generateSlug = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

const nextNumericId = (collection: { id: number }[]) =>
  collection.reduce((max, item) => Math.max(max, item.id), 0) + 1;

const collectGroups = (orgs: Organization[]) => orgs.flatMap((org) => org.groups);
const collectUsers = (orgs: Organization[]) => orgs.flatMap((org) => org.users);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [organizationsState, setOrganizations] = useState<Organization[]>(initialOrganizations);
  const [coursesState, setCourses] = useState<Course[]>(initialCourses);
  const [subscribersState] = useState<Subscriber[]>(initialSubscribers);
  const [subscriptionsState] = useState<Subscription[]>(initialSubscriptions);

  const addOrganization = (input: AddOrganizationInput) => {
    if (!input.name.trim()) {
      return;
    }

    const id = nextNumericId(organizationsState);
    const newOrganization: Organization = {
      id,
      name: input.name.trim(),
      slug: generateSlug(input.name) || `org-${id}`,
      createdAt: new Date().toISOString(),
      sector: input.sector.trim(),
      city: input.city.trim(),
      users: [],
      groups: [],
      courseIds: []
    };

    setOrganizations((prev) => [...prev, newOrganization]);
  };

  const addGroup = (organizationId: number, input: AddGroupInput) => {
    if (!input.name.trim()) {
      return;
    }

    setOrganizations((prev) => {
      const groupId = nextNumericId(collectGroups(prev));
      const users = collectUsers(prev);
      const shouldCreateManager = input.managerName && input.managerEmail;
      const managerId = shouldCreateManager ? nextNumericId(users) : 0;
      const newUser: OrganizationUser | null = shouldCreateManager
        ? {
            id: managerId,
            name: input.managerName!.trim(),
            email: input.managerEmail!.trim(),
            role: 'manager',
            lastLogin: new Date().toISOString()
          }
        : null;

      return prev.map((organization) => {
        if (organization.id !== organizationId) {
          return organization;
        }

        const newGroup: Group = {
          id: groupId,
          name: input.name.trim(),
          organizationId,
          description: input.description?.trim(),
          managerId: newUser ? newUser.id : 0
        };

        return {
          ...organization,
          users: newUser ? [...organization.users, newUser] : organization.users,
          groups: [...organization.groups, newGroup]
        };
      });
    });
  };

  const addCourse = (input: AddCourseInput) => {
    if (!input.name.trim()) {
      return;
    }

    const newCourse: Course = {
      id: nextNumericId(coursesState),
      name: input.name.trim(),
      price: input.price,
      durationDays: input.durationDays,
      description: input.description.trim()
    };

    setCourses((prev) => [...prev, newCourse]);
  };

  const value = useMemo(
    () => ({
      organizations: organizationsState,
      courses: coursesState,
      subscribers: subscribersState,
      subscriptions: subscriptionsState,
      addOrganization,
      addGroup,
      addCourse
    }),
    [organizationsState, coursesState, subscribersState, subscriptionsState]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
