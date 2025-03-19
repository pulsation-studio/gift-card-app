export enum PartnerRole {
  SALARY = 'Salary',
  MANAGER = 'Manager',
}

export const PartnerRoleLabel = {
  [PartnerRole.SALARY]: 'Salarié(e)',
  [PartnerRole.MANAGER]: 'Gérant(e)',
}

export type PartnerRoles = PartnerRole[]
