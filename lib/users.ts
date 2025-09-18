export type User = {
  id: string;
  iam: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type UserInfo = {
  user: User;
  permissionId: string;
  teamSlug: string;
  authenticationType: string;
  isAuthenticated: boolean;
};
